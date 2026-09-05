export default function classNames(
	...classes: Array<string | false | null | undefined>
) {
	return classes.filter(Boolean).join(' ')
}
