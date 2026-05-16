"use client";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

// Wrapper CKEditor 5 cho rich text
export function AdminRichTextEditor({ value, onChange }) {
	return (
		<div className="ckeditor-wrapper">
			<CKEditor
				config={{
					licenseKey: "GPL",
				}}
				data={value}
				editor={ClassicEditor}
				onChange={(_event, editor) => {
					onChange(editor.getData());
				}}
				onError={(_error) => {}}
				onReady={(_editor) => {}}
			/>
		</div>
	);
}
