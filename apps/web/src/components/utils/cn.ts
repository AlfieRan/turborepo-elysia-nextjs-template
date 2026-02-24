import { ClassValue, clsx } from 'clsx';
import { Config, extendTailwindMerge, mergeConfigs } from 'tailwind-merge';

type GenericConfig = Config<string, string>;
function WithInstructClasses(config: GenericConfig): GenericConfig {
	return mergeConfigs(config, {
		extend: {
			classGroups: {
				'instruct.font-weight': [
					{
						font: ['regular', 'medium', 'semibold', 'bold', 'black'],
					},
				],
			},
		},
	});
}

const twMerge = extendTailwindMerge(WithInstructClasses);

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};
