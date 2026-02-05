import { Check } from 'lucide-react';

export function BlueTickBadge({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <span className={`inline-flex items-center justify-center bg-blue-500 rounded-full text-white ${className}`} title="Verified Doctor">
            <Check className="w-[70%] h-[70%] stroke-[3]" />
        </span>
    );
}
