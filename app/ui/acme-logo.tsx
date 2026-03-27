import { ChartBarSquareIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <ChartBarSquareIcon className="h-10 w-10 shrink-0 md:h-12 md:w-12" />
      <p className="text-[28px] md:text-[40px]">Pinnacle</p>
    </div>
  );
}
