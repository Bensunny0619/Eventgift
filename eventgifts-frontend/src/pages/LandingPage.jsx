import { ArrowRight, Sparkles, Diamond, ShieldCheck, Video, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="bg-exquisite-cream dark:bg-exquisite-midnight text-slate-900 dark:text-white transition-colors duration-500">

            {/* Hero Section */}
            <section className="relative pt-20 pb-40 lg:pt-40 lg:pb-64 overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-10 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center space-x-3 px-6 py-2 bg-exquisite-gold/10 border border-exquisite-gold/20 rounded-full mb-10 animate-in fade-in slide-in-from-left-4 duration-1000">
                            <Diamond className="h-4 w-4 text-exquisite-gold" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-exquisite-gold">The Art of Celebration</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif leading-[1.1] mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                            Where <span className="text-exquisite-gold italic">exquisite</span> moments meet timeless gratitude.
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-10 sm:mb-16 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                            Curate world-class registries, engage distinguished guests, and immortalize every gift with personalized cinematic thank-yous.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                            <Link to="/register" className="w-full sm:w-auto px-12 py-5 gold-gradient text-white text-lg font-bold rounded-2xl shadow-2xl shadow-exquisite-gold/30 hover:scale-105 transition-all flex items-center justify-center space-x-3 group">
                                <span>Create Your Account</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link to="/explore" className="w-full sm:w-auto px-12 py-5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-lg font-bold rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-all text-center">
                                View Collections
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-20 dark:opacity-10 translate-x-1/4">
                    <Diamond className="w-full h-full text-exquisite-gold" />
                </div>
                <div className="absolute top-1/2 right-20 -translate-y-1/2 w-[500px] h-[700px] bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl rotate-6 hidden lg:block overflow-hidden border border-white/20">
                    <div className="h-full w-full gold-gradient opacity-10 flex items-center justify-center">
                        <Sparkles className="h-40 w-40 text-exquisite-gold opacity-20" />
                    </div>
                </div>
            </section>

            {/* Features: The Exquisite Standard */}
            <section className="py-32 bg-white dark:bg-exquisite-midnight border-y border-slate-100 dark:border-white/5">
                <div className="max-w-[1400px] mx-auto px-10">
                    <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
                        <h2 className="text-3xl md:text-6xl font-serif mb-6 sm:mb-8 italic">The Exquisite Standard</h2>
                        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium tracking-tight">An ecosystem of luxury features designed for the discerning host.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                        {[
                            {
                                icon: <Diamond className="h-8 w-8 text-exquisite-gold" />,
                                title: "Smart Registry",
                                desc: "Dynamic item management with seamless partial contribution support for high-value acquisitions."
                            },
                            {
                                icon: <ShieldCheck className="h-8 w-8 text-exquisite-gold" />,
                                title: "Secure Pledges",
                                desc: "Elite verification protocol ensures every contribution is accounted for and authenticated."
                            },
                            {
                                icon: <Video className="h-8 w-8 text-exquisite-gold" />,
                                title: "Gratitude Hub",
                                desc: "Elevate your 'thank you' with high-definition video messages delivered straight to your guests."
                            },
                            {
                                icon: <Heart className="h-8 w-8 text-exquisite-gold" />,
                                title: "Gift Service",
                                desc: "Curated gift selections and personalized assistance for your guests, 24/7."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group space-y-8 p-10 exquisite-card hover:translate-y-[-10px] transition-all duration-500">
                                <div className="h-16 w-16 bg-exquisite-cream dark:bg-white/5 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:bg-exquisite-gold group-hover:text-white transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-serif">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA: Final Invitation */}
            <section className="py-40">
                <div className="max-w-[1200px] mx-auto px-10 text-center">
                    <div className="exquisite-card p-20 dark:bg-slate-900/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 gold-gradient opacity-10 -mr-32 -mt-32 rounded-full blur-3xl"></div>
                        <div className="relative z-10 space-y-12">
                            <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif max-w-4xl mx-auto leading-tight italic">Your masterpiece awaits initiation.</h2>
                            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">Join Homa. and transform your next celebration into an legendary experience.</p>
                            <div className="pt-6">
                                <Link to="/register" className="px-16 py-6 gold-gradient text-white text-xl font-bold rounded-2xl shadow-2xl shadow-exquisite-gold/30 hover:scale-105 transition-all inline-block uppercase tracking-[0.2em] text-sm">
                                    Become a Member
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Placeholder for Branding */}
            <footer className="py-20 border-t border-slate-100 dark:border-white/5 opacity-50">
                <div className="max-w-[1400px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
                    <span className="text-2xl font-black tracking-tighter">Homa.</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">© 2026 Exquisite Light Registry. All Rights Reserved.</p>
                    <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <Link to="#" className="hover:text-exquisite-gold transition-colors">Instagram</Link>
                        <Link to="#" className="hover:text-exquisite-gold transition-colors">Pinterest</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
