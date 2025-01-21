import { AuthService } from "../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { User, Users } from "../../models/auth.model";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <header class="header">
        <h1 class="title">User Management</h1>
      </header>

      <main class="content">
        <table class="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <button class="delete-btn" (click)="deleteUser(user.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="users.length === 0" class="no-users">No users found.</p>
      </main>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f9fafb;
        font-family: "Arial", sans-serif;
      }

      .header {
        background-color: #1d4ed8;
        color: white;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .title {
        margin: 0;
        font-size: 24px;
      }

      .content {
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .user-table {
        width: 100%;
        max-width: 800px;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      .user-table th,
      .user-table td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }

      .user-table th {
        background-color: #1d4ed8;
        color: white;
        text-transform: uppercase;
        font-size: 14px;
        letter-spacing: 0.5px;
      }

      .user-table tr:last-child td {
        border-bottom: none;
      }

      .delete-btn {
        background-color: #ef4444;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .delete-btn:hover {
        background-color: #dc2626;
      }

      .no-users {
        margin-top: 20px;
        font-size: 16px;
        color: #6b7280;
      }
    `,
  ],
})
export class UserComponent implements OnInit {
  users: Users[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (response: { code: number; data: Users[] }) => {
        this.users = response.data; // Trích xuất mảng `data` từ API
        console.log("Users loaded:", this.users);
      },
      error: (err) => {
        console.error("Error fetching users", err);
      },
    });
  }
  deleteUser(userId: number) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          console.log(`User with ID ${userId} deleted successfully.`);
          // Cập nhật danh sách người dùng sau khi xóa
          this.users = this.users.filter((user) => user.id !== userId);
        },
        error: (err) => {
          console.error(`Error deleting user with ID ${userId}`, err);
        },
      });
    }
  }
}
