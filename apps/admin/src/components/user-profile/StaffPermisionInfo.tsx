"use client";  
import React, { useEffect, useState, useMemo } from "react";  
import axios from "axios";  
import Button from "../ui/button/Button";  

interface Permission {   
  id: number;   
  codename: string;   
  name: string;   
  app: string; 
}  

export default function PermissionInfoCard({ userId }: { userId: string }) {   
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);   
  const [selectedIds, setSelectedIds] = useState<number[]>([]);   
  const [loading, setLoading] = useState(true);   
  const [expandedApp, setExpandedApp] = useState<string | null>(null);   
  const [saving, setSaving] = useState(false);    

  /* ======================       
    FETCH DATA   
  ====================== */   
  useEffect(() => {     
    const fetchData = async () => {       
      try {         
        setLoading(true);         
        const token = localStorage.getItem("access_token");         
        const headers = { Authorization: `Bearer ${token}` };          

        // 1. Fetch the master list of all possible permissions         
        const resAll = await axios.get(           
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/permissions/`,            
          { headers }         
        );          

        // 2. Fetch the specific permissions already assigned to this user         
        const resUser = await axios.get(           
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/permissions/${userId}/`,            
          { headers }         
        );          

        setAllPermissions(resAll.data);                  

        // Ensure we extract only the IDs for the checkboxes         
        if (resUser.data && resUser.data.permissions) {           
          setSelectedIds(resUser.data.permissions.map((p: any) => p.id));         
        }       
      } catch (e) {         
        console.error("Error fetching permission data:", e);       
      } finally {         
        setLoading(false);       
      }     
    };      

    if (userId) fetchData();   
  }, [userId]);    

  /* ======================       
    LOGIC & HANDLERS   
  ====================== */    

  // Group all permissions by their "app" label   
  const grouped = useMemo(() => {     
    return allPermissions.reduce((acc, p) => {       
      if (!acc[p.app]) acc[p.app] = [];       
      acc[p.app].push(p);       
      return acc;     
    }, {} as Record<string, Permission[]>);   
  }, [allPermissions]);    

  const handleToggle = (id: number) => {     
    setSelectedIds((prev) =>       
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]     
    );   
  };    

  const handleSave = async () => {     
    setSaving(true);     
    try {       
      const token = localStorage.getItem("access_token");       
      const headers = { Authorization: `Bearer ${token}` };        

      // Update user permissions via PATCH       
      await axios.patch(         
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/permissions/${userId}/`,         
        { permissions: selectedIds },         
        { headers }       
      );              

      alert("Permissions updated successfully!");     
    } catch (e) {       
      console.error("Update error:", e);       
      alert("Failed to update permissions. Please try again.");     
    } finally {       
      setSaving(false);     
    }   
  };    

  if (loading) return <div className="p-10 text-center font-medium">Loading Permissions...</div>;    

  return (     
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm">       
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">         
        <div>           
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">User Access Control</h3>           
          <p className="text-sm text-gray-500 dark:text-gray-400">Directly manage user-specific permissions</p>         
        </div>         
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">           
          {saving ? "Processing..." : "Save Changes"}         
        </Button>       
      </div>        

      <div className="space-y-3">         
        {Object.entries(grouped).map(([appName, perms]) => {           
          const isExpanded = expandedApp === appName;            

          return (             
            <div key={appName} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">               
              {/* Accordion Header */}               
              <button                 
                onClick={() => setExpandedApp(isExpanded ? null : appName)}                 
                className={`w-full flex justify-between items-center p-4 transition-colors ${                   
                  isExpanded ? "bg-brand-50/50 dark:bg-brand-900/10" : "bg-gray-50 dark:bg-white/5"                 
                }`}               
              >                 
                <div className="flex items-center gap-3">                   
                  <span className="font-bold uppercase text-xs tracking-widest text-gray-600 dark:text-gray-400">                     
                    {appName}                   
                  </span>                 
                </div>                 
                <span className="text-gray-400 font-mono text-lg">{isExpanded ? "−" : "+"}</span>               
              </button>                              

              {/* Checkbox Grid */}               
              {isExpanded && (                 
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white dark:bg-transparent border-t border-gray-100 dark:border-gray-700">                   
                  {perms.map((p) => (                     
                    <label                        
                      key={p.id}                        
                      className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all"                     
                    >                       
                      <input                          
                        type="checkbox"                          
                        className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500 transition-all cursor-pointer"                         
                        checked={selectedIds.includes(p.id)}                          
                        onChange={() => handleToggle(p.id)}                       
                      />                       
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">                         
                        {p.name}                       
                      </span>                     
                    </label>                   
                  ))}                 
                </div>               
              )}             
            </div>           
          );         
        })}       
      </div>     
    </div>   
  ); 
}
