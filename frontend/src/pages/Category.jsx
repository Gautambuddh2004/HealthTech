import { useParams } from "react-router-dom";

export default function Category() {
  const { cat } = useParams();

  return (
    <div className="w-full bg-gray-50 px-4 py-10 text-center">
      <h1 className="w-full text-xl sm:text-2xl md:text-3xl  lg:text-4xl font-bold text-blue-600 break-words leading-snug">
        {cat}
      </h1>
    </div>
  );
}
