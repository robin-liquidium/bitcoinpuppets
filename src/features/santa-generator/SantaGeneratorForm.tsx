import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";

type GeneratorState = {
  previewUrl: string | null;
  resultUrl: string | null;
  isSubmitting: boolean;
  error: string | null;
};

const initialState: GeneratorState = {
  previewUrl: null,
  resultUrl: null,
  isSubmitting: false,
  error: null,
};

export default function SantaGeneratorForm() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<GeneratorState>(initialState);

  useEffect(() => {
    if (!file) {
      setState((prev) => ({ ...prev, previewUrl: null }));
      return;
    }

    const url = URL.createObjectURL(file);
    setState((prev) => ({ ...prev, previewUrl: url }));

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    setState((prev) => ({ ...prev, error: null, resultUrl: null }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setState((prev) => ({ ...prev, error: "Pick a puppet image first." }));
      return;
    }

    const formData = new FormData();
    formData.append("puppet", file);

    setState((prev) => ({
      ...prev,
      isSubmitting: true,
      error: null,
      resultUrl: null,
    }));

    try {
      const response = await fetch("/api/santa-generator", {
        method: "POST",
        body: formData,
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof (payload as { error?: unknown }).error === "string"
            ? String((payload as { error?: unknown }).error)
            : "Santa hat install failed. Try again.";
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: message,
        }));
        return;
      }

      const imageBase64 =
        payload &&
        typeof payload === "object" &&
        "imageBase64" in payload &&
        typeof (payload as { imageBase64?: unknown }).imageBase64 === "string"
          ? String((payload as { imageBase64?: unknown }).imageBase64)
          : null;

      if (!imageBase64) {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: "No image came back. Try again.",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        resultUrl: `data:image/png;base64,${imageBase64}`,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: "Network hiccup. Try again.",
      }));
    }
  };

  return (
    <div className="pixel-border bg-white/90 p-5 text-black">
      <div className="window-titlebar mb-4 flex items-center justify-between px-3 py-2">
        <span className="text-sm font-bold uppercase">Upload + Generate</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="pixel-border bg-white p-4 flex flex-col gap-2 text-sm uppercase font-bold">
          <span>Upload your puppet image</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="text-sm font-normal"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="pixel-border bg-white p-3">
            <div className="text-xs font-bold uppercase mb-2">Preview</div>
            {state.previewUrl ? (
              <img
                src={state.previewUrl}
                alt="Uploaded Bitcoin Puppet preview"
                width={512}
                height={512}
                className="w-full border-4 border-black"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="border-4 border-dashed border-black bg-puppet-gray/30 px-3 py-6 text-center text-xs uppercase font-bold">
                waiting for puppet
              </div>
            )}
          </div>

          <div className="pixel-border bg-white p-3">
            <div className="text-xs font-bold uppercase mb-2">Santa Result</div>
            {state.resultUrl ? (
              <img
                src={state.resultUrl}
                alt="Bitcoin Puppet with Santa hat"
                width={512}
                height={512}
                className="w-full border-4 border-black"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="border-4 border-dashed border-black bg-puppet-green/30 px-3 py-6 text-center text-xs uppercase font-bold">
                santa hat pending
              </div>
            )}
          </div>
        </div>

        {state.error ? (
          <div className="pixel-border bg-puppet-pink px-3 py-2 text-sm font-bold uppercase">
            {state.error}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={state.isSubmitting}
            className="pixel-border bg-puppet-purple px-4 py-2 text-sm font-bold uppercase hover:-translate-y-0.5 hover:shadow-press transition disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {state.isSubmitting
              ? "Generating..."
              : state.resultUrl
                ? "Re-generate Santa Hat"
                : "Generate Santa Hat"}
          </button>
          {state.resultUrl ? (
            <a
              href={state.resultUrl}
              download="puppet-santa.png"
              className="pixel-border bg-puppet-yellow px-4 py-2 text-sm font-bold uppercase inline-block hover:-translate-y-0.5 hover:shadow-press transition"
            >
              Download PNG
            </a>
          ) : null}
        </div>

        <p className="text-xs uppercase font-bold">
          Upload your puppet and hit generate to give it the christmas spirit.
          It uses AI to remove existing hats and add the Santa hat instead.
          Output might not be perfect.
        </p>
      </form>
    </div>
  );
}
