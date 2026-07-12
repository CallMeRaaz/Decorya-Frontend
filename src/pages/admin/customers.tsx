import { Key, ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userAPI";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import Loader from "../../components/loader";
import { responseToast } from "../../utils/features";
import Model from "../../components/admin/Model";
import userPNG from "../../assets/frontend_assets/userPNG.png";
import { useToast } from "../../components/context/toastprovider";
import Raaz from "../../assets/Raaz/developer_img.jpg";

import A1 from "../../assets/frontend_assets/A1.png";
import A2 from "../../assets/frontend_assets/A2.png";
import A3 from "../../assets/frontend_assets/A3.png";
import A4 from "../../assets/frontend_assets/A4.png";

interface DataType {
avatar: string | null
  key: Key | null | undefined;
  photo: ReactElement;
  name: string;
  email: string;
  role: string;
  editAction: ReactElement;
  deleteAction: ReactElement;
}

const Customers = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { isLoading, data, isError, error } = useAllUsersQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);
  const [deleteUser] = useDeleteUserMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { showToast } = useToast();



const deleteHandler = async (userId: string) => {
  const res = await deleteUser({
    userId,
    adminUserId: user?._id!,
  });

responseToast(res, showToast, undefined);
};

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      showToast(err.data.message, "error");
    }
  }, [isError, error]);

  useEffect(() => {
    if (data) {
    const newRows = data.users.map((i) => ({
  key: i._id,
  avatar: i.avatar ?? "",
  photo: (
    <img
      src={userPNG}
      alt={i.name}
      className="w-10 h-10 object-cover rounded-full"
    />
  ),
  name: i.name,
  email: i.email,
  role: i.role,
  editAction: (
    <Link to={`/admin/user/${i._id}`} className="text-blue-600">
      Edit
    </Link>
  ),
  deleteAction: (
    <button
      onClick={() => deleteHandler(i._id)}
      className="text-red-600"
    >
      <FaTrash />
    </button>
  ),
}));
      setRows(newRows);
    }
  }, [data]);

  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const paginatedRows = rows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <Model />

      <main>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="min-h-screen bg-gray-50 flex flex-col sm:ml-16 pt-28 px-5">
            <div className="relative pb-10">
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs h-12 text-gray-700 uppercase bg-gray-200">
                    <tr>
                      <th className="px-6 py-4"> Profile</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Edit</th>
                      <th className="px-3 py-4">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.length > 0 ? (
                      paginatedRows.map((user, index) => (
                        <tr
                          key={user.key}
                          className={`border-b transition ${
                            index % 2 === 0 ? "" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="w-8 h-8">
                              {user.email === "raj54raja@gmail.com" ? (
                                <img
                                  src={Raaz}
                                  alt="Raaz"
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <img
                                  src={
                                    user.avatar === "A1"
                                      ? A1
                                      : user.avatar === "A2"
                                        ? A2
                                        : user.avatar === "A3"
                                          ? A3
                                          : user.avatar === "A4"
                                            ? A4
                                            : userPNG
                                  }
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {user.email === "raj54raja@gmail.com"
                              ? "Raaz"
                              : user.name}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {user.email === "raj54raja@gmail.com"
                              ? "- - - -"
                              : user.email}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.email === "raj54raja@gmail.com"
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                  : user.role === "admin"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {user.email === "raj54raja@gmail.com"
                                ? "Developer"
                                : user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.email === "raj54raja@gmail.com"
                              ? "- -"
                              : user.editAction}
                          </td>
                          <td className="px-6 py-4">
                            {user.email === "raj54raja@gmail.com"
                              ? "- -"
                              : user.deleteAction}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center mt-4 sm:mb-10">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 mx-5 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 mx-5 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Customers;
