import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
  href: string;
  imageUrl: string;
  title: string;
}

export default function CategoryCard({ href, imageUrl, title }: CategoryCardProps) {
  return (
    <Link href={href} className="group relative block rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 h-64">
      <Image 
        src={imageUrl}
        alt={`Camisetas de ${title}`}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-60 group-hover:opacity-40 transition-all duration-300 flex items-center justify-center">
        <h3 className="text-white text-3xl font-bold">{title.toUpperCase()}</h3>
      </div>
    </Link>
  );
}