import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loading from "@/components/Loading";

interface ViewModalProps {
  employeeId: string;
}

type Employee = {
  _id: string;
  name: string;
  email: string;
  position?: string;
};

type Review = {
  _id: string;
  clientName: string;
  date: string;
  rating: number;
  description: string;
};

function ViewModal({ employeeId }: ViewModalProps) {
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId || !open) return;

    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`/api/employees/${employeeId}`);
        console.log("Employee details:", response.data);

        setEmployee(response.data.employee);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <Loading />
        ) : employee ? (
          <div className="space-y-4">
            <div>
              <Label>Name:</Label>
              <p>{employee.name}</p>
            </div>
            <div>
              <Label>Email:</Label>
              <p>{employee.email}</p>
            </div>
            {employee.position && (
              <div>
                <Label>Position:</Label>
                <p>{employee.position}</p>
              </div>
            )}
            <h3 className="font-semibold mt-4">Reviews</h3>
            {reviews.length > 0 ? (
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {reviews.map((review) => (
                  <li
                    key={review._id}
                    className="p-3 border rounded-lg bg-gray-50"
                  >
                    <p>
                      <strong>Client:</strong> {review.clientName}
                    </p>
                    <p>
                      <strong>Date:</strong> {review.date}
                    </p>
                    <p>
                      <strong>Rating:</strong> {review.rating} / 5
                    </p>
                    <p>{review.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
        ) : (
          <p>Employee not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ViewModal;
