export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          SIM-AMI SPs UIKA
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Sistem Informasi Manajemen Audit Mutu Internal
        </p>
        <p className="text-lg">
          Sekolah Pascasarjana - Universitas Ibn Khaldun Bogor
        </p>
        
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Development Mode - PostgreSQL Laragon Local
          </p>
        </div>
      </div>
    </div>
  );
}
