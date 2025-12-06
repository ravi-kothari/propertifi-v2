import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './faq.component.html'
})
export class FaqComponent {
    faqs = [
        {
            question: 'How does Propertifi work?',
            answer: 'Propertifi connects property owners with top-rated property managers. Owners submit their property details, and our algorithm matches them with the best local managers.',
            isOpen: true
        },
        {
            question: 'Is it free for property owners?',
            answer: 'Yes, Propertifi is completely free for property owners. You can browse managers and receive proposals at no cost.',
            isOpen: false
        },
        {
            question: 'How do you vet property managers?',
            answer: 'We verify all property managers on our platform, checking their licenses, insurance, and track record to ensure high-quality service.',
            isOpen: false
        },
        {
            question: 'Can I manage my own properties?',
            answer: 'Yes, we offer tools for self-managing landlords, including tenant screening, rent collection, and maintenance tracking.',
            isOpen: false
        },
        {
            question: 'What areas do you cover?',
            answer: 'We currently cover major metropolitan areas across the United States. Check our "Services" page for a full list of locations.',
            isOpen: false
        }
    ];

    toggle(index: number) {
        this.faqs[index].isOpen = !this.faqs[index].isOpen;
    }
}
