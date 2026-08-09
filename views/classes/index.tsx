import React, { useEffect, useState } from 'react';
import { getAllClasses, deleteClassAsAdmin, ClassSession } from '../../services/classes';

const AdminClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getAllClasses();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching all classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteClassAsAdmin(id);
        fetchClasses(); // Refresh list
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading all classes...</div>;
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Manage Classes</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="uppercase tracking-wider border-b-2">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Tutor</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Start Time</th>
              <th className="px-6 py-4">Students</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No classes found.
                </td>
              </tr>
            ) : (
              classes.map((cls) => (
                <tr key={cls._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{cls.title}</td>
                  <td className="px-6 py-4">
                    {cls.tutorId?.firstName} {cls.tutorId?.lastName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                      {cls.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(cls.startTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{cls.students?.length || 0}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDelete(cls._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClasses;
