import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { X, MapPin, Calendar, User, Camera, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ReportDetailsModal({ 
  open, 
  onClose, 
  report, 
  onAssign, 
  onAddComment 
}: {
  open: boolean;
  onClose: () => void;
  report: any;
  onAssign?: (staff: string) => void;
  onAddComment?: (comment: string) => void;
}) {
  const [staff, setStaff] = useState("");
  const [comment, setComment] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!report) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "submitted": return "bg-purple-100 text-purple-800 border-purple-200";
      case "draft": return "bg-gray-100 text-gray-800 border-gray-200";
      case "closed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-0 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
                  <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 dark:text-white">
                    {report.title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="max-h-[80vh] overflow-y-auto p-6">
                  {/* Status and Priority Badges */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {report.status?.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}>
                      {report.priority?.toUpperCase()} PRIORITY
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {report.category}
                    </span>
                  </div>

                  {/* Report Image */}
                  {report.image_url && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Camera className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Report Photo</span>
                      </div>
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        {!imageError ? (
                          <img
                            src={report.image_url}
                            alt="Report evidence"
                            className="w-full h-64 object-cover"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <div className="text-center">
                              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Image could not be loaded</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Report Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                        <p className="text-gray-900 dark:text-white">{report.description || "No description provided"}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</h4>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <p className="text-gray-900 dark:text-white">{report.address || "Location not specified"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reporter</h4>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <p className="text-gray-900 dark:text-white">{report.reporter || "Anonymous"}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Submitted</h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <p className="text-gray-900 dark:text-white">{formatDate(report.created_at)}</p>
                        </div>
                      </div>

                      {report.resolved_at && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resolved</h4>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <p className="text-gray-900 dark:text-white">{formatDate(report.resolved_at)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Action Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Assign Staff */}
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          if (staff && onAssign) {
                            onAssign(staff);
                            setStaff("");
                          }
                        }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Assign to Staff
                        </label>
                        <div className="flex gap-2">
                          <input 
                            value={staff} 
                            onChange={e => setStaff(e.target.value)} 
                            placeholder="Staff name or email" 
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                          <button 
                            type="submit" 
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                          >
                            Assign
                          </button>
                        </div>
                      </form>

                      {/* Add Comment */}
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          if (comment && onAddComment) {
                            onAddComment(comment);
                            setComment("");
                          }
                        }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Add Comment
                        </label>
                        <div className="flex gap-2">
                          <input 
                            value={comment} 
                            onChange={e => setComment(e.target.value)} 
                            placeholder="Add a comment..." 
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                          <button 
                            type="submit" 
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                          >
                            Add
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {report.comments && report.comments.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Comments</h4>
                      </div>
                      <div className="space-y-3">
                        {report.comments.map((c: any, i: number) => (
                          <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <p className="text-gray-900 dark:text-white">{typeof c === 'string' ? c : c.text || c.comment}</p>
                            {typeof c === 'object' && c.timestamp && (
                              <p className="text-xs text-gray-500 mt-1">{formatDate(c.timestamp)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

