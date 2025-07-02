export function Footer({isFullForm = false} : {isFullForm? : boolean}) {
  return (
    <footer className="mt-auto pt-3 text-xs text-center text-primary/70">
      <a
        href="https://flagpedia.net"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        Flags from Flagpedia.net
      </a>
      <br />
      © 2025 Phuwis — FlagQuizzer  
    </footer>
  );
}
