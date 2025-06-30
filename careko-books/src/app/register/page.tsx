"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { HiUser, HiMail, HiIdentification } from "react-icons/hi";
import { toast } from "sonner";
import { UserService } from "@/services/user.services";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    email: "",
    description: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await UserService.register({
        ...form,
        avatar,
      });
      toast.success("Cadastro realizado com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex justify-center items-center min-h-screen bg-blue-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md max-w-lg w-full">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-300 mb-6">
            CarekoBooks
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Crie sua conta
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <HiIdentification className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Nome de usuário"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="relative">
              <HiUser className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
              <input
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                placeholder="Nome completo"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="relative">
              <HiMail className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="E-mail"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descrição (biografia curta)"
              rows={3}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-300">
                <span className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg">
                  {avatar ? "Alterar foto" : "Escolher foto"}
                </span>
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="h-10 w-10 rounded-full object-cover border-2 border-blue-500"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Criar conta"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
