import { UserService } from "@/services/user.services";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, ImagePlus, ImageIcon, X } from "lucide-react";

interface UpdateUserModalProps {
  username: string;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export default function UpdateUserModal({ username, children, onSuccess }: UpdateUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && username) {
      setLoadingData(true);
      UserService.getUserByUsername(username)
        .then((response) => {
          if (response) {
            setFormData({
              username: response.username || "",
              displayName: response.displayName || "",
              description: response.description || "",
            });
            setCurrentImageUrl(response.image.url || null);
          }
        })
        .catch((error) => {
          console.error("Erro ao carregar usuário:", error);
          setError("Falha ao carregar dados do usuário");
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [isOpen, username]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageFile = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    handleImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await UserService.updateUser(username, {
        ...formData,
        image: image
      });
      
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setError("Falha ao atualizar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Editar Perfil</DialogTitle>
        </DialogHeader>
        
        {loadingData ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Imagem do Perfil</h3>
                
                <div 
                  className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all
                    ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary'}
                    ${previewImage || currentImageUrl ? 'h-auto' : 'min-h-[200px]'}`}
                  onClick={triggerFileSelect}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  
                  {previewImage || currentImageUrl ? (
                    <div className="relative w-full flex justify-center">
                      <div className="relative group">
                        <img 
                          src={previewImage || currentImageUrl || ''} 
                          alt="Preview" 
                          className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImagePlus className="text-white w-8 h-8" />
                          <span className="sr-only">Alterar imagem</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-4">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Arraste uma imagem ou clique para selecionar
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        Formatos: PNG, JPG (max. 5MB)
                      </p>
                    </div>
                  )}
                  
                  {(previewImage || image) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-4 text-destructive hover:text-destructive/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Remover imagem
                    </Button>
                  )}
                  
                  <div className={`absolute inset-0 bg-primary/5 border-2 border-primary rounded-xl pointer-events-none transition-opacity ${
                    isDragging ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="bg-white rounded-lg p-3 shadow-lg">
                        <ImagePlus className="text-primary w-8 h-8 mx-auto" />
                        <p className="text-primary text-sm font-medium mt-2">Solte a imagem aqui</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">Nome de usuário *</label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="focus-visible:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="displayName" className="text-sm font-medium">Nome de exibição *</label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      required
                      className="focus-visible:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="min-h-[120px] focus-visible:ring-primary"
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>
                
                {error && (
                  <div className="text-destructive text-sm p-3 bg-destructive/10 rounded-md border border-destructive/20">
                    <span className="font-medium">Erro:</span> {error}
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-2 border-t border-muted-foreground/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                    className="hover:bg-muted"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="min-w-[140px] bg-primary hover:bg-primary/90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}