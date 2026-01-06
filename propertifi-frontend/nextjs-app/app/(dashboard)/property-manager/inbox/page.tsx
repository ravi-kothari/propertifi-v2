"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Inbox,
    Search,
    Mail,
    MailOpen,
    Star,
    Clock,
    User,
    MapPin,
    Home,
    Phone,
    ChevronRight,
    Loader2,
    Filter,
    ArrowUpDown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    property_address: string;
    unit_count: number;
    message: string;
    status: "new" | "contacted" | "qualified" | "closed";
    is_read: boolean;
    is_starred: boolean;
    created_at: string;
    match_score?: number;
}

// Mock data for development
const MOCK_LEADS: Lead[] = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "(555) 123-4567",
        property_address: "123 Main St, San Francisco, CA 94102",
        unit_count: 4,
        message: "I have a 4-unit property in SF that I need help managing. Currently self-managing but looking for professional help with tenant relations and maintenance.",
        status: "new",
        is_read: false,
        is_starred: true,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        match_score: 92,
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@gmail.com",
        phone: "(555) 987-6543",
        property_address: "456 Oak Ave, Oakland, CA 94612",
        unit_count: 8,
        message: "Looking for full-service property management for my multi-family building. Need help with tenant screening, rent collection, and maintenance coordination.",
        status: "contacted",
        is_read: true,
        is_starred: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        match_score: 87,
    },
    {
        id: 3,
        name: "Michael Chen",
        email: "mchen@techcorp.com",
        phone: "(555) 456-7890",
        property_address: "789 Pine St, Berkeley, CA 94704",
        unit_count: 2,
        message: "I recently purchased a duplex and need management services. This is my first investment property.",
        status: "qualified",
        is_read: true,
        is_starred: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        match_score: 78,
    },
];

export default function InboxPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

    useEffect(() => {
        // Simulate API fetch
        const fetchLeads = async () => {
            setLoading(true);
            try {
                // TODO: Replace with actual API call
                // const response = await fetch('/api/v1/pm/leads');
                // const data = await response.json();
                await new Promise(resolve => setTimeout(resolve, 500));
                setLeads(MOCK_LEADS);
            } catch (error) {
                console.error("Failed to fetch leads:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.property_address.toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === "unread") return matchesSearch && !lead.is_read;
        if (filter === "starred") return matchesSearch && lead.is_starred;
        return matchesSearch;
    });

    const unreadCount = leads.filter(l => !l.is_read).length;

    const getStatusColor = (status: Lead["status"]) => {
        switch (status) {
            case "new": return "bg-blue-100 text-blue-700";
            case "contacted": return "bg-yellow-100 text-yellow-700";
            case "qualified": return "bg-green-100 text-green-700";
            case "closed": return "bg-slate-100 text-slate-700";
        }
    };

    const markAsRead = (leadId: number) => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, is_read: true } : l));
    };

    const toggleStar = (leadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, is_starred: !l.is_starred } : l));
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Inbox className="w-6 h-6 text-propertifi-orange" />
                        Lead Inbox
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Manage incoming leads and inquiries
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Badge className="bg-propertifi-orange text-white px-3 py-1">
                        {unreadCount} new {unreadCount === 1 ? "lead" : "leads"}
                    </Badge>
                )}
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search leads by name, email, or address..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={filter === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter("all")}
                                className={filter === "all" ? "bg-propertifi-orange hover:bg-propertifi-orange-dark" : ""}
                            >
                                All
                            </Button>
                            <Button
                                variant={filter === "unread" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter("unread")}
                                className={filter === "unread" ? "bg-propertifi-orange hover:bg-propertifi-orange-dark" : ""}
                            >
                                Unread
                            </Button>
                            <Button
                                variant={filter === "starred" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter("starred")}
                                className={filter === "starred" ? "bg-propertifi-orange hover:bg-propertifi-orange-dark" : ""}
                            >
                                <Star className="w-4 h-4 mr-1" />
                                Starred
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lead List */}
                <div className="lg:col-span-1">
                    <Card className="h-[600px] overflow-hidden">
                        <CardHeader className="py-3 border-b">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                {filteredLeads.length} {filteredLeads.length === 1 ? "Lead" : "Leads"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto h-[calc(600px-60px)]">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-6 h-6 animate-spin text-propertifi-orange" />
                                </div>
                            ) : filteredLeads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                    <Mail className="w-12 h-12 mb-2 opacity-50" />
                                    <p>No leads found</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredLeads.map((lead, index) => (
                                        <motion.div
                                            key={lead.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedLead?.id === lead.id ? "bg-propertifi-orange/5 border-l-2 border-propertifi-orange" : ""
                                                } ${!lead.is_read ? "bg-blue-50/50" : ""}`}
                                            onClick={() => {
                                                setSelectedLead(lead);
                                                markAsRead(lead.id);
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    {lead.is_read ? (
                                                        <MailOpen className="w-5 h-5 text-slate-400" />
                                                    ) : (
                                                        <Mail className="w-5 h-5 text-blue-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className={`font-medium truncate ${!lead.is_read ? "text-slate-900" : "text-slate-700"}`}>
                                                            {lead.name}
                                                        </span>
                                                        <button
                                                            onClick={(e) => toggleStar(lead.id, e)}
                                                            className="flex-shrink-0"
                                                        >
                                                            <Star className={`w-4 h-4 ${lead.is_starred ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-slate-500 truncate">{lead.property_address}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge className={`text-xs ${getStatusColor(lead.status)}`}>
                                                            {lead.status}
                                                        </Badge>
                                                        <span className="text-xs text-slate-400">
                                                            {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Lead Detail */}
                <div className="lg:col-span-2">
                    <Card className="h-[600px] overflow-hidden">
                        {selectedLead ? (
                            <>
                                <CardHeader className="border-b">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-xl">{selectedLead.name}</CardTitle>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Received {formatDistanceToNow(new Date(selectedLead.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {selectedLead.match_score && (
                                                <Badge className="bg-green-100 text-green-700">
                                                    {selectedLead.match_score}% Match
                                                </Badge>
                                            )}
                                            <Badge className={getStatusColor(selectedLead.status)}>
                                                {selectedLead.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 overflow-y-auto h-[calc(600px-100px)]">
                                    {/* Contact Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <div className="text-xs text-slate-500">Email</div>
                                                <a href={`mailto:${selectedLead.email}`} className="text-sm font-medium text-propertifi-blue hover:underline">
                                                    {selectedLead.email}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <div className="text-xs text-slate-500">Phone</div>
                                                <a href={`tel:${selectedLead.phone}`} className="text-sm font-medium text-propertifi-blue hover:underline">
                                                    {selectedLead.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Property Info */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Property Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <div>
                                                    <div className="text-xs text-slate-500">Address</div>
                                                    <div className="text-sm font-medium">{selectedLead.property_address}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                <Home className="w-4 h-4 text-slate-400" />
                                                <div>
                                                    <div className="text-xs text-slate-500">Units</div>
                                                    <div className="text-sm font-medium">{selectedLead.unit_count} units</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Message</h4>
                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <p className="text-slate-700 leading-relaxed">{selectedLead.message}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Button className="flex-1 bg-propertifi-orange hover:bg-propertifi-orange-dark">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Reply via Email
                                        </Button>
                                        <Button variant="outline" className="flex-1">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call Lead
                                        </Button>
                                    </div>
                                </CardContent>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                <Inbox className="w-16 h-16 mb-4 opacity-30" />
                                <p className="text-lg font-medium">Select a lead to view details</p>
                                <p className="text-sm">Click on any lead from the list to see the full message</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
