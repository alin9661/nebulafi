"use client"
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { User, Bell, Shield, Lock, Building2, Save } from 'lucide-react';

export default function SettingsPage() {
  const [profileForm, setProfileForm] = useState({
    displayName: 'Admin User',
    email: 'admin@nebula.fi',
    bio: 'Building the future of finance.'
  });
  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [twoFactor, setTwoFactor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <div className="space-y-8 animate-fade-in-up">
       <div className="mb-8">
          <h2 className="text-3xl font-display font-bold mb-2">SETTINGS</h2>
          <p className="text-gray-400 font-mono text-sm">Manage your account and organization preferences.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Profile Section */}
           <div className="lg:col-span-2 space-y-6">
              <GlassCard>
                 <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <User className="w-6 h-6 text-white" />
                    <h3 className="text-lg font-bold font-display uppercase tracking-wide">Profile</h3>
                 </div>

                 <div className="flex items-start gap-8">
                    <div className="w-24 h-24 bg-white/5 border border-white/20 flex items-center justify-center relative group cursor-pointer">
                        <div className="text-4xl font-display font-bold text-white">AD</div>
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-mono text-white uppercase">Edit</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Display Name</label>
                                <input
                                  type="text"
                                  value={profileForm.displayName}
                                  onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 py-2 px-3 text-sm text-white focus:outline-none focus:border-white font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Email</label>
                                <input
                                  type="email"
                                  value={profileForm.email}
                                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                  className="w-full bg-white/5 border border-white/10 py-2 px-3 text-sm text-white focus:outline-none focus:border-white font-mono"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Bio</label>
                            <textarea
                              value={profileForm.bio}
                              onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 py-2 px-3 text-sm text-white focus:outline-none focus:border-white font-mono h-20 resize-none"
                            />
                        </div>
                        <button className="px-4 py-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                           <Save className="w-3 h-3" />
                           <span>Save Changes</span>
                        </button>
                    </div>
                 </div>
              </GlassCard>

              {/* Notification Settings */}
              <GlassCard>
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <Bell className="w-6 h-6 text-white" />
                    <h3 className="text-lg font-bold font-display uppercase tracking-wide">Notifications</h3>
                 </div>
                 <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
                        <div>
                            <div className="font-bold text-sm font-display text-white">Email Notifications</div>
                            <div className="text-xs font-mono text-gray-400">Receive updates about governance and transactions.</div>
                        </div>
                        <button
                          onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${notifications.email ? 'bg-white' : 'bg-gray-700'}`}
                        >
                            <div className={`w-3 h-3 rounded-full bg-black absolute top-1 transition-all ${notifications.email ? 'left-6' : 'left-1'}`}></div>
                        </button>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
                        <div>
                            <div className="font-bold text-sm font-display text-white">Push Notifications</div>
                            <div className="text-xs font-mono text-gray-400">Browser alerts for urgent actions.</div>
                        </div>
                        <button
                          onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${notifications.push ? 'bg-white' : 'bg-gray-700'}`}
                        >
                            <div className={`w-3 h-3 rounded-full bg-black absolute top-1 transition-all ${notifications.push ? 'left-6' : 'left-1'}`}></div>
                        </button>
                     </div>
                 </div>
              </GlassCard>
           </div>

           {/* Sidebar Settings */}
           <div className="space-y-6">
               {/* Role Simulator */}
               <GlassCard className="bg-white/5 border-white/20">
                   <div className="flex items-center gap-3 mb-4">
                       <Shield className="w-5 h-5 text-white" />
                       <h3 className="font-bold font-display uppercase tracking-wide text-sm">Role Simulator</h3>
                   </div>
                   <p className="text-xs text-gray-400 font-mono mb-4">Toggle permissions to test the dashboard as different user types.</p>
                   <div className="flex items-center justify-between bg-black p-2 border border-white/10">
                       <span className="text-xs font-mono font-bold uppercase pl-2">{isAdmin ? 'Admin' : 'Member'}</span>
                        <button
                            onClick={() => setIsAdmin(!isAdmin)}
                            className={`w-12 h-6 rounded-full p-0.5 transition-colors ${isAdmin ? 'bg-white' : 'bg-gray-800'}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-black shadow-lg transform transition-transform ${isAdmin ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                   </div>
               </GlassCard>

               {/* Security */}
               <GlassCard>
                   <div className="flex items-center gap-3 mb-4">
                       <Lock className="w-5 h-5 text-white" />
                       <h3 className="font-bold font-display uppercase tracking-wide text-sm">Security</h3>
                   </div>

                   <div className="space-y-4">
                       <div>
                           <div className="text-[10px] text-gray-400 uppercase font-mono mb-1">Connected Wallet</div>
                           <div className="flex items-center justify-between p-2 bg-white/5 border border-white/10 text-xs font-mono">
                               <span>0x1a...bc9</span>
                               <span className="text-green-400 text-[10px] uppercase">Active</span>
                           </div>
                       </div>

                       <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-gray-300">2FA Enabled</span>
                             <button
                                onClick={() => setTwoFactor(!twoFactor)}
                                className={`w-8 h-4 rounded-full relative transition-colors ${twoFactor ? 'bg-green-500' : 'bg-gray-700'}`}
                            >
                                <div className={`w-2 h-2 rounded-full bg-white absolute top-1 transition-all ${twoFactor ? 'left-5' : 'left-1'}`}></div>
                            </button>
                       </div>
                   </div>
               </GlassCard>

               {/* Org Preferences (Admin Only) */}
               {isAdmin && (
                   <GlassCard>
                       <div className="flex items-center gap-3 mb-4">
                           <Building2 className="w-5 h-5 text-white" />
                           <h3 className="font-bold font-display uppercase tracking-wide text-sm">Organization</h3>
                       </div>
                       <div className="space-y-3">
                           <div>
                               <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Default Currency</label>
                               <select className="w-full bg-black border border-white/10 text-white text-xs px-2 py-1.5 focus:outline-none">
                                   <option>USDC</option>
                                   <option>USDT</option>
                               </select>
                           </div>
                           <div className="flex items-center justify-between pt-2">
                                <span className="text-xs font-mono text-gray-300">Public Profile</span>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                           </div>
                       </div>
                   </GlassCard>
               )}
           </div>
       </div>
    </div>
  );
}
