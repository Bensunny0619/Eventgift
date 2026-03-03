import { ArrowRight, CheckCircle2, Star, Users, Gift, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 bg-gradient-to-b from-white to-primary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-8 animate-fade-in">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold tracking-wide uppercase">The New Way to Celebrate</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
                        Gifts that <span className="text-primary-600">matter</span>,<br className="hidden md:block" /> memories that last.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Create a registry for your special event, invite loved ones, and receive meaningful contributions. Say thank you with personalized videos.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary-200 transition-all hover:-translate-y-1 transform">
                            Start Your Registry
                        </Link>
                        <Link to="/explore" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 text-lg font-bold rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-primary-300">
                            Explore Events
                        </Link>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
            </section>

            {/* Feature Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why choose Homa.?</h2>
                        <p className="text-slate-600 max-w-xl mx-auto">Modern features designed for seamless event management and heartwarming gratitude.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Gift className="h-8 w-8 text-primary-600" />,
                                title: "Flexible Registry",
                                desc: "Add any item or fund. Guests can contribute partial amounts to expensive gifts."
                            },
                            {
                                icon: <Users className="h-8 w-8 text-primary-600" />,
                                title: "Guest Interaction",
                                desc: "Engage with your guests through messages and shared celebrations."
                            },
                            {
                                icon: <MessageSquare className="h-8 w-8 text-primary-600" />,
                                title: "Video Thanks",
                                desc: "Send personalized video notes to thank your contributors. Make it special."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-100 transition-all duration-300">
                                <div className="mb-6 inline-block bg-white p-4 rounded-2xl shadow-sm group-hover:bg-primary-50 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary-600 rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary-200">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8">Ready to start your first event?</h2>
                            <p className="text-primary-100 text-lg mb-12 max-w-xl mx-auto">Join thousands of hosts making their celebrations more organized and meaningful.</p>
                            <Link to="/register" className="inline-flex items-center px-8 py-4 bg-white text-primary-700 text-lg font-bold rounded-2xl hover:bg-primary-50 transition-all">
                                Create Account <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                        {/* CTA Background Deco */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
