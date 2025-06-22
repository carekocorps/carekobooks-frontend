import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-500 bg-red-50 p-6 rounded-xl max-w-md text-center">
        <h2 className="font-bold text-lg mb-2">Erro ao carregar perfil</h2>
        <p>{error}</p>
        <Button className="mt-4" onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}