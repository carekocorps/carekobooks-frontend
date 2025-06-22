export default function UserNotFoundState() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-blue-50 text-blue-800 p-6 rounded-xl max-w-md text-center">
        <h2 className="font-bold text-lg mb-2">Usuário não encontrado</h2>
        <p>O perfil solicitado não está disponível</p>
      </div>
    </div>
  );
}