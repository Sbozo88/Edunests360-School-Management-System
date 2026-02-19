import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { MapPin, Bus, User, Navigation, Trash2 } from 'lucide-react';
import { UserRole } from '../types';

interface TransportManagerProps {
    userRole?: UserRole;
}

const INITIAL_ROUTES = [
    { id: 101, name: 'Route #101', bus: 'BN-2021', driver: 'Mr. Michael Knight', area: 'Downtown - North Campus', capacity: 45, total: 50 },
    { id: 102, name: 'Route #102', bus: 'BN-2022', driver: 'Mr. John Wick', area: 'West End - South Campus', capacity: 30, total: 40 },
    { id: 103, name: 'Route #103', bus: 'BN-2023', driver: 'Ms. Sarah Connor', area: 'Suburbs - Main Campus', capacity: 48, total: 50 },
    { id: 104, name: 'Route #104', bus: 'BN-2024', driver: 'Mr. James Bond', area: 'City Center - East Campus', capacity: 40, total: 45 },
];

export const TransportManager: React.FC<TransportManagerProps> = ({ userRole }) => {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [routes, setRoutes] = useState(INITIAL_ROUTES);

  // Only Admins can manage routes
  const canEdit = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN;

  const handleDelete = (id: number) => {
      if (window.confirm("Are you sure you want to delete this transport route?")) {
          setRoutes(routes.filter(r => r.id !== id));
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Transport & Fleet</h1>
        {canEdit && (
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200">
            + Add Route
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {routes.map(route => (
          <Card key={route.id} className="hover:shadow-lg transition-shadow group relative">
             {canEdit && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(route.id); }}
                    className="absolute top-4 right-4 p-1.5 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Delete Route"
                 >
                    <Trash2 size={16} />
                 </button>
             )}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                   <Bus size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800">{route.name}</h3>
                   <p className="text-xs text-slate-500">Bus: {route.bus}</p>
                 </div>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold self-start mr-8">Active</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <User size={16} className="text-slate-400" />
                <span>Driver: {route.driver}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={16} className="text-slate-400" />
                <span>{route.area}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
               <span className="text-xs text-slate-400">Capacity: {route.capacity}/{route.total}</span>
               <button 
                 onClick={() => setSelectedRoute(route.id)}
                 className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
               >
                   <Navigation size={14} /> Track Live
               </button>
            </div>
          </Card>
        ))}
        {routes.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                No active routes found.
            </div>
        )}
      </div>

      <Modal 
        title={`Live Tracking: Route #${selectedRoute}`} 
        isOpen={!!selectedRoute} 
        onClose={() => setSelectedRoute(null)}
      >
          <div className="w-full h-96 bg-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center">
              {/* Dummy Map Visuals */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover"></div>
              
              <div className="relative z-10 flex flex-col items-center animate-bounce">
                  <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg mb-2">
                      Moving • 45 km/h
                  </div>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-indigo-600">
                      <Bus size={16} className="text-indigo-600" />
                  </div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1"></div>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-xl shadow-lg border border-slate-200">
                  <div className="flex justify-between items-center">
                      <div>
                          <p className="text-xs text-slate-500">Next Stop</p>
                          <p className="font-bold text-slate-800">Maple Street Station</p>
                      </div>
                      <div className="text-right">
                          <p className="text-xs text-slate-500">ETA</p>
                          <p className="font-bold text-emerald-600">5 mins</p>
                      </div>
                  </div>
              </div>
          </div>
      </Modal>
    </div>
  );
};