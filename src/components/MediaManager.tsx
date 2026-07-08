"use client";

import { useActionState, useRef, useTransition } from "react";
import {
  addMediaAction,
  deleteImageAction,
  deleteVideoAction,
  type MediaFormState,
} from "@/app/admin/propiedades/actions";

type MediaItem = { id: string; url: string };

export function MediaManager({
  propertyId,
  imagenes,
  videos,
}: {
  propertyId: string;
  imagenes: MediaItem[];
  videos: MediaItem[];
}) {
  const boundAdd = addMediaAction.bind(null, propertyId);
  const [state, formAction, pending] = useActionState<MediaFormState, FormData>(
    boundAdd,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [deleting, startDeleting] = useTransition();

  return (
    <div className="space-y-6">
      <form
        ref={formRef}
        action={(formData) => {
          formAction(formData);
          formRef.current?.reset();
        }}
        className="rounded-lg border border-dashed border-neutral-300 p-4"
      >
        <label className="block text-sm font-medium text-neutral-700">
          Subir fotos o videos
        </label>
        <input
          type="file"
          name="files"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
          className="mt-2 block w-full text-sm"
        />
        {state.error && (
          <p className="mt-2 text-sm text-red-600">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="mt-3 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {pending ? "Subiendo…" : "Subir"}
        </button>
      </form>

      <div>
        <h3 className="text-sm font-medium text-neutral-700">
          Fotos ({imagenes.length})
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {imagenes.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-md border border-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-28 w-full object-cover" />
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  startDeleting(() => deleteImageAction(propertyId, img.id))
                }
                className="absolute right-1 top-1 rounded bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100"
              >
                Eliminar
              </button>
            </div>
          ))}
          {imagenes.length === 0 && (
            <p className="col-span-full text-sm text-neutral-400">Sin fotos aún.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-700">
          Videos ({videos.length})
        </h3>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {videos.map((vid) => (
            <div key={vid.id} className="group relative overflow-hidden rounded-md border border-neutral-200">
              <video src={vid.url} controls className="h-40 w-full object-cover" />
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  startDeleting(() => deleteVideoAction(propertyId, vid.id))
                }
                className="absolute right-1 top-1 rounded bg-black/60 px-2 py-0.5 text-xs text-white"
              >
                Eliminar
              </button>
            </div>
          ))}
          {videos.length === 0 && (
            <p className="col-span-full text-sm text-neutral-400">Sin videos aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}
