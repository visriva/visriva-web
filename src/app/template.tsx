export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div id="content" className="page-enter">
      {children}
    </div>
  );
}
