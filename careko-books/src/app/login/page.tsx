"use client";

import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
    return (
        <section className="flex justify-center items-center min-h-screen bg-[#F5F3FE] px-4">
            <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-lg max-w-4xl w-full overflow-hidden">
                {/* Login */}
                <div className="w-full lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                    <h2 className="text-2xl font-bold text-[#023e7d] mb-6">Já sou CarekoBooker</h2>
                    <form className="flex flex-col gap-4">
                        <input type="text" placeholder="E-mail ou nome de usuário" className="input" />
                        <input type="password" placeholder="Senha" className="input" />
                        <a href="#" className="text-sm text-blue-600 hover:underline">Esqueceu a senha</a>
                        <button className="btn-primary">Entrar</button>
                        <button className="btn-google whitespace-nowrap">
                            <FcGoogle size={20} />
                            Inicie sessão com o Google
                        </button>
                    </form>
                </div>

                {/* Cadastro */}
                <div className="w-full lg:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-[#023e7d] mb-6">Crie uma conta</h2>
                    <form className="flex flex-col gap-4">
                        <input type="text" placeholder="Insira o nome de usuário" className="input" />
                        <input type="email" placeholder="Insira e-mail" className="input" />
                        <label className="block -mb-3 text-sm font-semibold text-gray-700">Data de nascimento</label>
                        <div className="flex gap-2">
                            <select className="input max-h-10 overflow-auto">
                                <option>Dia</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i}>{i + 1}</option>
                                ))}
                            </select>
                            <select className="input">
                                <option>Mês</option>
                                {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m, i) => (
                                    <option key={i}>{m}</option>
                                ))}
                            </select>
                            <select className="input">
                                <option>Ano</option>
                                {[...Array(100)].map((_, i) => (
                                    <option key={i}>{2025 - i}</option>
                                ))}
                            </select>
                        </div>
                        <input type="password" placeholder="Insira uma nova senha" className="input" />
                        <input type="password" placeholder="Confirme sua senha" className="input" />
                        <button className="btn-primary">Criar conta com email</button>
                        <button className="btn-google">
                            <FcGoogle size={20} />
                            Inicie sessão com o Google
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
