import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OwnerService } from '../../../../core/services/owner.service';
import { Bookmark, BookmarksResponse } from '../../../../core/models/owner.model';
import { LeadCardComponent } from '../../../../shared/components/lead-card/lead-card.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-owner-bookmarks',
    standalone: true,
    imports: [CommonModule, RouterModule, LeadCardComponent, UiButtonComponent],
    templateUrl: './bookmarks.component.html'
})
export class OwnerBookmarksComponent implements OnInit {
    bookmarks: Bookmark[] = [];
    loading = true;

    constructor(private ownerService: OwnerService) { }

    ngOnInit() {
        this.loadBookmarks();
    }

    loadBookmarks() {
        this.ownerService.getBookmarks().subscribe({
            next: (response: BookmarksResponse) => {
                this.bookmarks = response.data;
                this.loading = false;
            },
            error: (err: unknown) => {
                console.error('Error fetching bookmarks', err);
                this.loading = false;
            }
        });
    }

    removeBookmark(id: number) {
        if (confirm('Are you sure you want to remove this bookmark?')) {
            this.ownerService.removeBookmark(id).subscribe({
                next: () => {
                    this.bookmarks = this.bookmarks.filter(b => b.id !== id);
                },
                error: (err: unknown) => {
                    console.error('Error removing bookmark', err);
                }
            });
        }
    }
}
