import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage } from '@inertiajs/react';

const PLATFORMS = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
];

export default function Dashboard({ socialConnections, videoPublications }) {
    const { flash } = usePage().props;

    const connectionForm = useForm({
        platform: 'facebook',
        account_label: '',
        access_token: '',
        is_enabled: true,
    });

    const videoForm = useForm({
        title: '',
        video: null,
    });

    const submitConnection = (e) => {
        e.preventDefault();
        connectionForm.post(route('social-connections.store'), {
            preserveScroll: true,
            onSuccess: () => connectionForm.reset('access_token'),
        });
    };

    const submitVideo = (e) => {
        e.preventDefault();
        videoForm.post(route('video-publications.store'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => videoForm.reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Publicador automático de videos
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Conectar cuenta social</h3>
                            <form onSubmit={submitConnection} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="platform" value="Plataforma" />
                                    <select
                                        id="platform"
                                        value={connectionForm.data.platform}
                                        onChange={(e) => connectionForm.setData('platform', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {PLATFORMS.map((platform) => (
                                            <option key={platform.key} value={platform.key}>
                                                {platform.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <InputLabel htmlFor="account_label" value="Nombre de la cuenta/página" />
                                    <TextInput
                                        id="account_label"
                                        value={connectionForm.data.account_label}
                                        className="mt-1 block w-full"
                                        onChange={(e) => connectionForm.setData('account_label', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="access_token" value="Token de acceso" />
                                    <TextInput
                                        id="access_token"
                                        type="password"
                                        value={connectionForm.data.access_token}
                                        className="mt-1 block w-full"
                                        onChange={(e) => connectionForm.setData('access_token', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={connectionForm.errors.access_token} />
                                </div>

                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={connectionForm.data.is_enabled}
                                        onChange={(e) => connectionForm.setData('is_enabled', e.target.checked)}
                                    />
                                    Activar esta cuenta para publicaciones automáticas.
                                </label>

                                <PrimaryButton disabled={connectionForm.processing}>Guardar conexión</PrimaryButton>
                            </form>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Subir video</h3>
                            <form onSubmit={submitVideo} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="title" value="Título" />
                                    <TextInput
                                        id="title"
                                        value={videoForm.data.title}
                                        className="mt-1 block w-full"
                                        onChange={(e) => videoForm.setData('title', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={videoForm.errors.title} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="video" value="Archivo de video" />
                                    <input
                                        id="video"
                                        type="file"
                                        accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska"
                                        onChange={(e) => videoForm.setData('video', e.target.files[0])}
                                        className="mt-1 block w-full text-sm"
                                    />
                                    <InputError className="mt-2" message={videoForm.errors.video} />
                                </div>

                                <PrimaryButton disabled={videoForm.processing}>Subir y publicar</PrimaryButton>
                            </form>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Cuentas conectadas</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            {PLATFORMS.map((platform) => {
                                const connection = socialConnections.find((item) => item.platform === platform.key);

                                return (
                                    <li key={platform.key}>
                                        <span className="font-medium">{platform.label}:</span>{' '}
                                        {connection
                                            ? `${connection.account_label || 'Cuenta registrada'} · ${connection.is_enabled ? 'Activa' : 'Inactiva'}`
                                            : 'Sin configurar'}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Últimos videos</h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            {videoPublications.length === 0 && <p>No hay videos todavía.</p>}
                            {videoPublications.map((video) => (
                                <div key={video.id} className="rounded border border-gray-200 p-3">
                                    <p className="font-medium text-gray-900">{video.title}</p>
                                    <p>Estado general: {video.status}</p>
                                    <p>Facebook: {video.facebook_status} · Instagram: {video.instagram_status}</p>
                                    {video.result_message && <p className="text-gray-600">{video.result_message}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
