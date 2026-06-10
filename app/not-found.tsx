import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="scene flex flex-col items-center justify-center text-center px-6">
      <p className="text-label mb-6">404</p>
      <h1 className="text-heading text-text-primary mb-4">Page not found</h1>
      <p className="text-body text-text-secondary mb-12">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="text-text-primary text-sm font-medium border border-border-strong px-6 py-3 hover:border-accent transition-colors duration-200"
      >
        Return home
      </Link>
    </div>
  );
}
