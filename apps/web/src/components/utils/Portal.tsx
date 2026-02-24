'use client';

import { Config } from '@/config';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
	children: React.ReactNode;
	rootId?: string;
};

export function Portal({ children, rootId = Config.containers.modal }: PortalProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const modalRoot = document.getElementById(rootId);
	if (!modalRoot) {
		return null;
	}

	return createPortal(children, modalRoot);
}
