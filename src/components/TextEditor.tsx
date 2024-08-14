'use client';
import { Editor } from '@tinymce/tinymce-react';
import React from 'react';
import './TextEditor.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function TextEditor({ value, onChange }: Props) {
  return (
    <Editor
      value={value}
      onEditorChange={onChange}
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      init={{
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #0A0A0A; color: #fff;}',
        skin: 'oxide-dark',
      }}
    />
  );
}

export default TextEditor;
