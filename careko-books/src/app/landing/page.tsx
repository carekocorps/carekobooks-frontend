'use client';
import { useState, useEffect } from 'react';
import { FiBook, FiBarChart2, FiUsers, FiStar, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from "next/image";

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      content: "Finalmente consigo acompanhar todos os meus livros. Interface linda e simples.",
      author: "Amanda Vieira",
      role: "Escritora",
      img: <Image
                src="/landing-page/amanda.png"
                alt="Foto de Amanda Vieira"
                width={800}
                height={800}
                className="object-cover"
                />
    },
    {
      id: 2,
      content: "CarekoBooks mudou a forma como organizo minhas leituras. Recomendo!",
      author: "João Pedro",
      role: "Gênio",
      img: <Image
                src="/landing-page/joao.png"
                alt="Foto de João Pedro"
                width={800}
                height={800}
                className="object-cover"
                />
    },
    {
      id: 3,
      content: "Acompanhar meu progresso de leitura nunca foi tão satisfatório. Amei!",
      author: "Isaac Duarte",
      role: "Artista",
      img: <Image
                src="/landing-page/isaac.png"
                alt="Foto de Isaac Duarte"
                width={900}
                height={900}
                className="object-cover"
                />
    },
    {
      id: 4,
      content: "O CarekoBooks é uma experiência! Divônico!",
      author: "Huan Passos",
      role: "Jogador",
      img: <Image
                src="/landing-page/huan.png"
                alt="Foto de Huan Passos"
                width={900}
                height={900}
                className="object-cover"
                />
    }
  ];
  
  const features = [
    {
      icon: <FiBook className="w-10 h-10" />,
      title: "Busca Inteligente",
      description: "Busque o livro desejado com nossos filtros avançados.",
      img: <Image
                src="/landing-page/search.png"
                alt="Imagem de busca de livros"
                width={800}
                height={800}
                className="object-cover"
                />
    },
    {
      icon: <FiBarChart2 className="w-10 h-10" />,
      title: "Acompanhamento de Progresso",
      description: "Veja quanto você já leu e trace suas metas de leitura.",
      img: <Image
                src="/landing-page/dashboard.png"
                alt="Dashboard de progresso"
                width={800}
                height={800}
                className="object-cover"
                />
    },
    {
      icon: <FiUsers className="w-10 h-10" />,
      title: "Compartilhamento com Amigos",
      description: "Mostre suas leituras para outras pessoas e descubra novas obras.",
      img: <Image
                src="/landing-page/home.png"
                alt="Compartilhamento de leituras"
                width={800}
                height={800}
                className="object-cover"
                />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-[#001233] dark:to-[#001233] text-gray-900 dark:text-white overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#001233]/90 backdrop-blur-sm border-b border-gray-200 dark:border-[#0466C8]">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-[#0466C8] w-10 h-10 rounded-lg flex items-center justify-center">
              <FiBook className="text-white w-6 h-6" />
            </div>
            <span className="ml-3 text-2xl font-bold text-[#0466C8] dark:text-[#C1E8FF]">CarekoBooks</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="font-medium hover:text-[#0466C8] dark:hover:text-[#C1E8FF] transition">Recursos</a>
            <a href="#testimonials" className="font-medium hover:text-[#0466C8] dark:hover:text-[#C1E8FF] transition">Depoimentos</a>
            <a href="#how-it-works" className="font-medium hover:text-[#0466C8] dark:hover:text-[#C1E8FF] transition">Como Funciona</a>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <a href="/login" className="text-[#0466C8] dark:text-[#C1E8FF] font-medium hover:underline text-sm sm:text-base">Entrar</a>
            <a href="/register" className="bg-[#0466C8] hover:bg-[#0357a9] text-white px-3 py-2 sm:px-5 sm:py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg text-sm sm:text-base">
              Criar Conta
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-40 md:pt-28 md:pb-48">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full">
            <div className="bg-gradient-to-l from-[#0466C8] to-[#001233] opacity-10 dark:opacity-20 w-full h-full"></div>
          </div>
          <div className="absolute top-0 left-0 w-1/2 h-full">
            <div className="bg-gradient-to-r from-[#0466C8] to-[#001233] opacity-5 dark:opacity-15 w-full h-full"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-16 md:mb-0">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
            >
              Transforme sua <span className="text-[#0466C8]">jornada</span> literária
            </motion.h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
              Registre suas leituras, acompanhe seu progresso e compartilhe histórias inesquecíveis com uma comunidade apaixonada por livros.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="/register"
                className="bg-[#0466C8] hover:bg-[#0357a9] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                Comece Agora
              </a>
              <a
                href="#features"
                className="border-2 border-[#0466C8] text-[#0466C8] dark:text-[#C1E8FF] px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition hover:bg-[#C1E8FF]/20 dark:hover:bg-[#001233]"
              >
                Saiba Mais
              </a>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full max-w-md lg:max-w-lg">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 sm:h-80 md:h-96 flex items-center justify-center text-gray-500">
                  <Image
                    src="/landing-page/landing.png"
                    alt="Imagem de livros para uma landing"
                    width={500}
                    height={500}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-gray-50 dark:bg-[#001233]/60">
        <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Por que usar o CarekoBooks?</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Uma plataforma completa para organizar e aprimorar sua experiência de leitura
            </p>
            </div>
            
            <div className="space-y-20 md:space-y-24">
            {features.map((feature, index) => (
                <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}
                >
                <div className="w-full md:w-1/2 h-[300px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl relative">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center text-gray-500">
                    {feature.img}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#0466C8]/10 dark:to-[#001233]/30 z-10"></div>
                    
                    <div className={`absolute -top-4 md:-top-6 ${index % 2 === 0 ? '-right-4 md:-right-6 rotate-12' : '-left-4 md:-left-6 -rotate-12'} w-16 h-16 md:w-24 md:h-24 bg-[#0466C8]/20 dark:bg-[#C1E8FF]/10 rounded-xl z-0`}></div>
                </div>
                
                <div className="w-full md:w-1/2 px-2 sm:px-0">
                    <div className="text-[#0466C8] dark:text-[#C1E8FF] mb-4 sm:mb-6">
                    {feature.icon}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{feature.title}</h3>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                    {feature.description}
                    </p>
                    
                    <div className="bg-[#C1E8FF]/20 dark:bg-[#0466C8]/20 p-3 sm:p-4 rounded-lg border border-[#0466C8]/30 dark:border-[#C1E8FF]/30">
                    <p className="text-[#0466C8] dark:text-[#C1E8FF] text-base sm:text-lg">
                        Transforme sua experiência de leitura com este recurso exclusivo
                    </p>
                    </div>
                </div>
                </motion.div>
            ))}
            </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-28 bg-gradient-to-br from-[#C1E8FF]/30 to-[#C1E8FF]/10 dark:from-[#001233] dark:to-[#001233]/90">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">O que dizem nossos leitores</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Junte-se a apaixonados por literatura que transformaram sua forma de ler
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="overflow-hidden px-2">
              <motion.div 
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-[#001233] rounded-3xl p-6 sm:p-8 shadow-xl"
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-6 md:mb-0 md:mr-8">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center text-gray-500">
                        {testimonials[currentTestimonial].img}
                      </div>
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-3 sm:mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar key={star} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg sm:text-xl italic mb-4 sm:mb-6">
                      "{testimonials[currentTestimonial].content}"
                    </blockquote>
                    <div>
                      <p className="font-bold text-lg sm:text-xl">{testimonials[currentTestimonial].author}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="flex justify-center mt-6 sm:mt-8 space-x-3 sm:space-x-4">
              <button 
                onClick={prevTestimonial}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-[#001233] shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#0466C8] transition"
              >
                <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-[#001233] shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#0466C8] transition"
              >
                <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-[#0466C8] to-[#001233] rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Pronto para começar sua jornada literária?</h2>
            <p className="text-lg sm:text-xl text-[#C1E8FF] mb-6 sm:mb-8 max-w-2xl mx-auto">
              Registre-se agora e transforme sua forma de ler e acompanhar livros
            </p>
            <a
              href="/register"
              className="inline-block bg-white text-[#0466C8] hover:bg-[#C1E8FF] px-8 py-3 sm:px-10 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              Criar Conta Gratuitamente
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}