import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage } from '@inertiajs/react';

const PLATFORMS = [
    { key: 'facebook', label: 'Facebook', field: 'publish_to_facebook' },
    { key: 'instagram', label: 'Instagram', field: 'publish_to_instagram' },
];

export default function VideoUpload({ socialConnections, videoPublications }) {
    const { flash } = usePage().props;

    const form = useForm({
        title: '',
        video: null,
        publish_to_facebook: false,
        publish_to_instagram: false,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('video-publications.store'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Subir video</h2>}>
            <Head title="Subir video" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    {flash.success && <div className="rounded bg-green-50 p-3 text-green-800">{flash.success}</div>}

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Nuevo video</h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="title" value="Título" />
                                <TextInput
                                    id="title"
                                    value={form.data.title}
                                    className="mt-1 block w-full"
                                    onChange={(e) => form.setData('title', e.target.value)}
                                />
                                <InputError className="mt-2" message={form.errors.title} />
                            </div>

                            <div>
                                <InputLabel htmlFor="video" value="Archivo de video" />
                                <input
                                    id="video"
                                    type="file"
                                    accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska"
                                    onChange={(e) => form.setData('video', e.target.files[0])}
                                    className="mt-1 block w-full text-sm"
                                />
                                <InputError className="mt-2" message={form.errors.video} />
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-800">¿Dónde quieres publicar?</p>
                                <div className="space-y-2">
                                    {PLATFORMS.map((platform) => {
                                        const connection = socialConnections.find((item) => item.platform === platform.key);

                                        return (
                                            <label key={platform.key} className="flex items-center gap-2 text-sm text-gray-700">
                                                <input
                                                    type="checkbox"
                                                    checked={form.data[platform.field]}
                                                    onChange={(e) => form.setData(platform.field, e.target.checked)}
                                                />
                                                {platform.label}
                                                <span className="text-xs text-gray-500">
                                                    ({connection?.is_enabled ? 'Configurada y activa' : 'No configurada/inactiva'})
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <PrimaryButton disabled={form.processing}>Subir video</PrimaryButton>
                        </form>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Historial reciente</h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            {videoPublications.length === 0 && <p>No hay videos todavía.</p>}
                            {videoPublications.map((video) => (
                                <div key={video.id} className="rounded border border-gray-200 p-3">
                                    <p className="font-medium text-gray-900">{video.title}</p>
                                    <p>Estado general: {video.status}</p>
                                    <p>Facebook: {video.facebook_status} · Instagram: {video.instagram_status}</p>
                                    {video.result_message && <p>{video.result_message}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
