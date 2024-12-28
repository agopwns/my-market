import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button className="btn btn-outline">Click me</button>
      <button className="btn">Click me</button>
      <button className="btn btn-primary">Click me</button>
      <button className="btn btn-secondary">Click me</button>
      <button className="btn btn-accent">Click me</button>
      <button className="btn btn-ghost">Click me</button>
      <button className="btn btn-link">Click me</button>
    </div>
  );
}
