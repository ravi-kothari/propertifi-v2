<?php

namespace App\Notifications;

use App\Models\Lead;
use App\Models\LeadAssignment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LeadMatchedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $lead;
    protected $assignment;

    /**
     * Create a new notification instance.
     *
     * @param Lead $lead
     * @param LeadAssignment $assignment
     * @return void
     */
    public function __construct(Lead $lead, LeadAssignment $assignment)
    {
        $this->lead = $lead;
        $this->assignment = $assignment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        // Database first to ensure notification is stored even if email fails
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $propertyType = ucfirst(str_replace('_', ' ', $this->lead->property_type));
        $location = "{$this->lead->city}, {$this->lead->state}";
        $matchScore = round($this->assignment->match_score);
        $distance = $this->assignment->distance_miles
            ? round($this->assignment->distance_miles, 1) . ' miles away'
            : 'In your service area';

        return (new MailMessage)
            ->subject("New Lead Match: {$propertyType} in {$location}")
            ->greeting("Hi {$notifiable->name}!")
            ->line("Great news! A new property lead matches your criteria.")
            ->line("**Property Details:**")
            ->line("- Type: {$propertyType}")
            ->line("- Location: {$location} {$this->lead->zipcode}")
            ->line("- Units: " . ($this->lead->number_of_units ?? 'N/A'))
            ->line("- Square Footage: " . ($this->lead->square_footage ? number_format($this->lead->square_footage) . ' sq ft' : 'N/A'))
            ->line("")
            ->line("**Match Score: {$matchScore}%** | {$distance}")
            ->action('View Lead Details', url("/property-manager/leads"))
            ->line("Act fast - leads are distributed to multiple matching managers!")
            ->salutation("Best regards,\nThe Propertifi Team");
    }

    /**
     * Get the database representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            'type' => 'lead_matched',
            'lead_id' => $this->lead->id,
            'assignment_id' => $this->assignment->id,
            'title' => 'New Lead Match',
            'message' => "A new {$this->lead->property_type} property in {$this->lead->city}, {$this->lead->state} matches your criteria.",
            'property_type' => $this->lead->property_type,
            'location' => "{$this->lead->city}, {$this->lead->state}",
            'match_score' => $this->assignment->match_score,
            'distance_miles' => $this->assignment->distance_miles,
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return $this->toDatabase($notifiable);
    }
}
