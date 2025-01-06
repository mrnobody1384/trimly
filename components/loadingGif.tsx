import Image from "next/image";

function LoadingGif() {
  return (
    <div className="flex justify-center items-center h-full">
      <Image
        src="/giphy.webp" // Replace with the actual path to your loading GIF
        alt="Loading..."
        width={100}
        height={100}
      />
    </div>
  );
}

export default LoadingGif;
