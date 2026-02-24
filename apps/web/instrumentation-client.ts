import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (POSTHOG_KEY) {
	posthog.init(POSTHOG_KEY, {
		cookieless_mode: 'on_reject',
		api_host: '/update',
		ui_host: 'https://eu.posthog.com',
		person_profiles: 'identified_only',
		defaults: '2026-01-30',
		session_recording: {
			maskAllInputs: false,
			maskInputOptions: {
				password: true,
				color: false,
				date: false,
				'datetime-local': false,
				email: false,
				month: false,
				number: false,
				range: false,
				search: false,
				tel: false,
				text: false,
				time: false,
				url: false,
				week: false,
				textarea: false,
				select: false,
			},
		},
	});
}
