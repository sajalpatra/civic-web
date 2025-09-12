import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function ReportDetailsModal({ open, onClose, report, onAssign, onAddComment }: {
  open: boolean;
  onClose: () => void;
  report: any;
  onAssign?: (staff: string) => void;
  onAddComment?: (comment: string) => void;
}) {
  const [staff, setStaff] = useState("");
  const [comment, setComment] = useState("");
  if (!report) return null;
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold mb-2">
                  {report.title}
                </Dialog.Title>
                <div className="mb-2 text-sm text-gray-600">{report.category} | {report.priority} | {report.status}</div>
                <div className="mb-2 text-black"><b>Description:</b> {report.description}</div>
                <div className="mb-2"><b>Address:</b> {report.address}</div>
                <div className="mb-2"><b>Created:</b> {new Date(report.created_at).toLocaleString()}</div>
                {report.photos && report.photos.length > 0 && (
                  <div className="mb-2">
                    <b>Photos:</b>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {report.photos.map((url: string, i: number) => (
                        <img key={i} src={url} alt="report" className="w-24 h-24 object-cover rounded border" />
                      ))}
                    </div>
                  </div>
                )}
                <div className="mb-4 flex gap-4">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (staff && onAssign) onAssign(staff);
                    }}
                    className="flex gap-2 items-end"
                  >
                    <div>
                      <label className="block text-xs font-semibold mb-1">Assign to staff</label>
                      <input value={staff} onChange={e => setStaff(e.target.value)} placeholder="Staff name or email" className="border rounded px-2 py-1" />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded font-semibold">Assign</button>
                  </form>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (comment && onAddComment) onAddComment(comment);
                      setComment("");
                    }}
                    className="flex gap-2 items-end"
                  >
                    <div>
                      <label className="block text-xs font-semibold mb-1">Add comment</label>
                      <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment" className="border rounded px-2 py-1" />
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded font-semibold">Add</button>
                  </form>
                </div>
                {report.comments && report.comments.length > 0 && (
                  <div className="mb-2">
                    <b>Comments:</b>
                    <ul className="list-disc ml-6 mt-1">
                      {report.comments.map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded font-semibold">Close</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

