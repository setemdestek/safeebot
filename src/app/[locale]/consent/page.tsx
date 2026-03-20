import { ConsentDeclaration } from "@/components/auth/ConsentDeclaration";
import { Logo, LogoWithText } from "@/components/common/Logo";

export default function ConsentPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[hsl(var(--primary))] relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)]" />
                <div className="relative z-10 text-center px-12">
                    <div className="w-32 h-32 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 p-2">
                        <Logo width={120} height={120} />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">SafeeBot</h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Təhlükəsiz Gələcək, Bu Gündən Başlayır
                    </p>
                </div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5" />
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
            </div>

            {/* Right — Content */}
            <div className="flex-1 flex flex-col items-center justify-start p-8 bg-[hsl(var(--background))] overflow-y-auto max-h-screen custom-scrollbar">
                <div className="w-full max-w-2xl flex flex-col relative py-12">
                    <div className="lg:hidden flex justify-center mb-8">
                        <LogoWithText />
                    </div>

                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Açıq Razılıq Bəyannaməsi</h1>
                        <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed text-center">
                            Bu bəyannamə istifadəçinin şəxsi məlumatlarının Safebot.az tərəfindən emal edilməsinə açıq və təsdiqlənmiş razılığını əks etdirir. Qeydiyyatdan keçməklə və ya sifariş verməklə aşağıdakı şərtlərlə tam razı olduğunuzu təsdiqləyirsiniz.
                        </p>
                    </div>

                    <ConsentDeclaration />
                </div>
            </div>
        </div>
    );
}
