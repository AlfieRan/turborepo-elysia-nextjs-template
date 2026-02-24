/**
 * Copy text to clipboard with cross-browser support.
 * Uses the modern Clipboard API with a fallback for iOS Safari.
 *
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves when copy succeeds, rejects on failure
 */
async function copyToClipboard(text: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(text);
		return;
	} catch {
		console.warn('Failed to copy to clipboard');
	}

	// Fallback for iOS Safari and older browsers
	const textArea = document.createElement('textarea');
	textArea.value = text;

	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.position = 'fixed';
	textArea.style.opacity = '0';

	document.body.appendChild(textArea);
	textArea.focus();

	textArea.setSelectionRange(0, text.length);

	let success = false;
	try {
		success = document.execCommand('copy');
	} catch {
		success = false;
	}

	document.body.removeChild(textArea);
	if (!success) throw new Error('Failed to copy to clipboard');
}

export { copyToClipboard };
