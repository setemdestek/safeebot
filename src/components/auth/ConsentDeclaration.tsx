"use client";

import { cn } from "@/lib/utils";

interface ConsentDeclarationProps {
    className?: string;
}

export function ConsentDeclaration({ className }: ConsentDeclarationProps) {
    const sections = [
        {
            title: "1. Şəxsi məlumatların emalına razılıq",
            desc: [
                "Ad və soyad",
                "Mobil nömrə",
                "Elektron poçt ünvanı",
                "Sifariş zamanı təqdim edilmiş məlumatlar"
            ],
            note: "Ödəniş zamanı tələb olunan kart və maliyyə məlumatları yalnız ödəniş sistemi tərəfindən emal olunur. SafeeBot.az bu məlumatlara heç bir halda çıxış əldə etmir və onları saxlamır."
        },
        {
            title: "2. Emal məqsədi",
            desc: [
                "Xidmətlərin göstərilməsi və sifarişlərin icrası",
                "Hesabların və abunəliklərin aktivləşdirilməsi",
                "Müştəri dəstəyinin təmin edilməsi",
                "Fırıldaqçılıq hallarının qarşısının alınması",
                "Qanunvericiliklə tələb olunan öhdəliklərin icrası",
                "Xidmətin aktivləşdirilməsi üçün zəruri məlumatların istifadəsi"
            ]
        },
        {
            title: "3. Üçüncü şəxslərə ötürülməsinə razılıq",
            desc: [
                "Məhsulun aktivləşdirilməsi üçün tələb olunan minimal məlumatların istifadə edilməsi",
                "Qanunla tələb olunduqda dövlət qurumlarına təqdim edilməsi"
            ],
            highlight: "SafeeBot.Az şəxsi məlumatları kommersiya məqsədi ilə satmır və üçüncü şəxslərə ötürmür."
        },
        {
            title: "4. Məlumatların saxlanması və istifadəsi",
            desc: [
                "4.1. İstifadəçi məlumatları yalnız xidmətin göstərilməsi və sifarişin icrası üçün tələb olunan müddətdə, həmçinin Azərbaycan Respublikasının qanunvericiliyinin tələblərinə uyğun şəkildə saxlanılır.",
                "4.2. SafeeBot.Az istifadəçinin təqdim etdiyi məlumatlardan əlavə emal məqsədilə istifadə etmir. Məlumatlar artıq tələb olunmadıqda təhlükəsiz şəkildə silinir və ya anonimləşdirilir.",
                "4.3. SafeeBot.Az yalnız sifarişın aktivləşdirilməsi və icrası üçün istifadəçinin təqdim etdiyi minimum məlumatlardan istifadə edir və sifariş tamamlandıqdan sonra bu məlumatların əlavə saxlanılması, ötürülməsi və ya istifadəsi həyata keçirilmir."
            ]
        },
        {
            title: "5. İstifadəçi hüquqları",
            subtitle: "İstifadəçi “Şəxsi məlumatlar haqqında” Qanuna əsasən aşağıdakı hüquqlara malik olduğunu təsdiqləyir:",
            desc: [
                "Öz məlumatlarına çıxış əldə etmək",
                "Məlumatların düzəldilməsini tələb etmək",
                "Məlumatların silinməsini tələb etmək (texniki və hüquqi imkanlar daxilində)",
                "Məlumatların emalına dair sual vermək"
            ]
        },
        {
            title: "6. Razılığı geri çəkmək",
            desc: [
                "İstifadəçi şəxsi məlumatlarının emalına verdiyi razılığı istənilən vaxt müraciət etməklə geri çəkə bilər. Razılığın geri çəkilməsi, geri çəkilmədən əvvəl edilmiş emalı qanunsuz etmir."
            ]
        },
        {
            title: "7. Təsdiq",
            subtitle: "İstifadəçi qeydiyyatdan keçməklə və/və ya sifariş verməklə aşağıdakıları təsdiq edir:",
            desc: [
                "Bu Açıq Razılıq Bəyannaməsini tam şəkildə oxudum;",
                "Şəxsi məlumatlarımın göstərilən məqsədlərlə emal edilməsinə açıq razılıq verirəm;",
                "Şərtlərin mənə aydın olduğunu və könüllü şəkildə qəbul etdiyimi bəyan edirəm."
            ]
        }
    ];

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {sections.map((section, idx) => (
                <div
                    key={idx}
                    className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 shadow-sm"
                >
                    <h3 className="text-xl font-bold mb-4 text-[hsl(var(--foreground))]">
                        {section.title}
                    </h3>

                    {section.subtitle && (
                        <p className="text-[hsl(var(--foreground)/0.9)] mb-3 font-medium">
                            {section.subtitle}
                        </p>
                    )}

                    <ul className={cn(
                        "space-y-2 pl-5",
                        idx === 6 ? "list-decimal" : "list-disc"
                    )}>
                        {section.desc.map((item, idy) => (
                            <li key={idy} className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                                {item}
                            </li>
                        ))}
                    </ul>

                    {section.note && (
                        <div className="mt-4 p-4 rounded-xl bg-[hsl(var(--primary)/0.05)] border-l-4 border-[hsl(var(--primary))] italic text-sm text-[hsl(var(--muted-foreground))]">
                            {section.note}
                        </div>
                    )}

                    {section.highlight && (
                        <p className="mt-4 font-bold text-[hsl(var(--primary))]">
                            {section.highlight}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
