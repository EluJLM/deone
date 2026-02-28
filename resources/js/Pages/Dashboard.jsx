import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ socialConnections, videoPublications }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Panel de automatización
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold">Configurar redes</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Conecta Facebook e Instagram en una pantalla separada.
                            </p>
                            <Link
                                href={route('social-settings.index')}
                                className="mt-4 inline-block rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Ir a configuración de redes
                            </Link>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold">Subir video</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Sube un video y marca con checkboxes en qué redes publicarlo.
                            </p>
                            <Link
                                href={route('video-publications.create')}
                                className="mt-4 inline-block rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Ir a subida de videos
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-3 text-lg font-semibold">Resumen rápido</h3>
                        <p className="text-sm text-gray-700">
                            Redes conectadas: <span className="font-medium">{socialConnections.length}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                            Últimos videos registrados: <span className="font-medium">{videoPublications.length}</span>
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
