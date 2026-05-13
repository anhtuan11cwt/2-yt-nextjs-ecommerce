import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

const Form = FormProvider;

const FormField = ({ control, name, render }) => {
	const context = useFormContext();
	return (
		<Controller
			control={control ?? context?.control}
			name={name}
			render={render}
		/>
	);
};

const FormItem = ({ className, children }) => (
	<div className={cn("space-y-2", className)}>{children}</div>
);

const FormLabel = ({ className, children, ...props }) => (
	<div {...props} className={cn("text-sm font-medium leading-none", className)}>
		{children}
	</div>
);

const FormControl = ({ children }) => <div>{children}</div>;

const FormMessage = ({ children, className }) => (
	<p className={cn("text-[0.8rem] font-medium text-destructive", className)}>
		{children}
	</p>
);

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage };
