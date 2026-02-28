import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage } from '@inertiajs/react';

const PLATFORMS = [
    {
        key: 'facebook',
        label: 'Facebook',
        tokenHelp: 'https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow/',
    },
    {
        key: 'instagram',
        label: 'Instagram',
        tokenHelp: 'https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/',
    },
];

export default function SocialSettings({ socialConnections }) {
    const { flash } = usePage().props;
    const form = useForm({
        platform: 'facebook',
        account_label: '',
        access_token: '',
        is_enabled: true,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('social-connections.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset('access_token'),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Configuración de redes</h2>}
        >
            <Head title="Configuración de redes" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    {flash.success && <div className="rounded bg-green-50 p-3 text-green-800">{flash.success}</div>}

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Conectar cuenta social</h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="platform" value="Plataforma" />
                                <select
                                    id="platform"
                                    value={form.data.platform}
                                    onChange={(e) => form.setData('platform', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                >
                                    {PLATFORMS.map((platform) => (
                                        <option key={platform.key} value={platform.key}>
                                            {platform.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <InputLabel htmlFor="account_label" value="Nombre de cuenta o página" />
                                <TextInput
                                    id="account_label"
                                    value={form.data.account_label}
                                    className="mt-1 block w-full"
                                    onChange={(e) => form.setData('account_label', e.target.value)}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="access_token" value="Token de acceso" />
                                <TextInput
                                    id="access_token"
                                    type="password"
                                    value={form.data.access_token}
                                    className="mt-1 block w-full"
                                    onChange={(e) => form.setData('access_token', e.target.value)}
                                />
                                <InputError className="mt-2" message={form.errors.access_token} />
                            </div>

                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_enabled}
                                    onChange={(e) => form.setData('is_enabled', e.target.checked)}
                                />
                                Dejar esta red activa para publicaciones automáticas.
                            </label>

                            <PrimaryButton disabled={form.processing}>Guardar red social</PrimaryButton>
                        </form>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Iniciar sesión u obtener token</h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            {PLATFORMS.map((platform) => (
                                <div key={platform.key} className="rounded border p-3">
                                    <p className="font-medium text-gray-900">{platform.label}</p>
                                    <div className="mt-2 flex flex-wrap gap-3">
                                        <a
                                            href={route('social-connections.oauth', platform.key)}
                                            className="rounded bg-indigo-600 px-3 py-1.5 text-white"
                                        >
                                            Iniciar sesión con {platform.label}
                                        </a>
                                        <a
                                            href={platform.tokenHelp}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded border border-indigo-600 px-3 py-1.5 text-indigo-600"
                                        >
                                            Ver guía para sacar token
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Redes guardadas</h3>
                        <ul className="space-y-2 text-sm">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
