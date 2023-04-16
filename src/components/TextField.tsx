import React, { InputHTMLAttributes } from "react";
import { useFormContext, useController } from "react-hook-form";
import cx from 'clsx'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	fieldName: string;
	label: string;
	className?: string
};

function TextField({ fieldName, label, className, ...props }: TextFieldProps) {
	const { register, control } = useFormContext();

	const {
		fieldState: { error },
	} = useController({
		name: fieldName,
		control,
		rules: { required: true },
	});

	return (
		<div className="flex flex-col">
			<label className="text-charcoal pb-.5">{label}</label>
			<input
				className={cx("py-1 px-2 truncate bg-gray-200 focus:outline-none focus:ring-orange focus:ring-2 rounded-lg w-full", className)}
				{...register(fieldName, {
					required: true,
				})}
				{...props}
			/>
			<p className="text-red-600 pt-px">{error?.message}</p>
		</div>
	);
}

export default TextField;
