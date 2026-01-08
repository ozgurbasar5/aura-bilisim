"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { 
  MessageSquare, Search, Clock, AlertCircle, 
  Trash2, X, User, RefreshCw
} from "lucide-react";

export default function AdminBayiDestekPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // YENİ TABLODAN VERİ ÇEKME
  const fetchTickets = async () => {
    setLoading(true);
    // Tablo adı 'bayi_destek' olarak güncellendi
    const { data, error } = await supabase
      .from('bayi_destek')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setTickets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // DURUM GÜNCELLEME
  const handleUpdateStatus = async (id: number, newStatus: string) => {
      const { error } = await supabase
          .from('bayi_destek')
          .update({ durum: newStatus })
          .eq('id', id);
      
      if (!error) {
          setTickets(tickets.map(t => t.id === id ? { ...t, durum: newStatus } : t));
          if(selectedTicket?.id === id) setSelectedTicket((prev: any) => ({...prev, durum: newStatus}));
      }
  };

  // SİLME İŞLEMİ
  const handleDelete = async (id: number) => {
      if(!confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
      
      const { error } = await supabase.from('bayi_destek').delete().eq('id', id);
      if(!error) {
          setTickets(tickets.filter(t => t.id !== id));
          if(selectedTicket?.id === id) setSelectedTicket(null);
      }
  };

  const filteredTickets = tickets.filter(t => {
      const matchesSearch = (t.bayi_adi?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                            (t.konu?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : t.durum === statusFilter;
      return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'İnceleniyor': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
          case 'Yanıtlandı': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
          case 'Çözüldü': return 'text-green-400 bg-green-500/10 border-green-500/20';
          default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
      }
  };

  return (
    <div className="p-8 min-h-screen bg-[#0b0e14] text-white font-sans flex flex-col md:flex-row gap-6">
      
      {/* SOL: LİSTE */}
      <div className={`${selectedTicket ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 h-[calc(100vh-8rem)]`}>
          <div className="mb-6">
              <h1 className="text-2xl font-black flex items-center gap-3 mb-1">
                  <MessageSquare className="text-purple-500" size={28}/> Bayi Destek
              </h1>
              <p className="text-slate-400 text-sm">Gelen destek talepleri (bayi_destek)</p>
          </div>

          <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                  <input 
                      type="text" 
                      placeholder="Bayi veya konu ara..." 
                      className="w-full bg-[#161b22] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-purple-500 outline-none"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                  />
              </div>
              <button onClick={fetchTickets} className="p-2.5 bg-[#161b22] border border-slate-700 rounded-xl hover:text-purple-400 transition-colors"><RefreshCw size={18}/></button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 custom-scrollbar">
              {['all', 'İnceleniyor', 'Yanıtlandı', 'Çözüldü'].map(st => (
                  <button 
                      key={st} 
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${statusFilter === st ? 'bg-purple-600 border-purple-500 text-white' : 'bg-[#161b22] border-slate-700 text-slate-400 hover:border-slate-500'}`}
                  >
                      {st === 'all' ? 'Tümü' : st}
                  </button>
              ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
              {loading ? (
                  <div className="text-center py-10 text-slate-500">Yükleniyor...</div>
              ) : filteredTickets.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-xl">Kayıt yok.</div>
              ) : (
                  filteredTickets.map(ticket => (
                      <div 
                          key={ticket.id}
                          onClick={() => setSelectedTicket(ticket)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-purple-500/50 ${selectedTicket?.id === ticket.id ? 'bg-purple-500/10 border-purple-500' : 'bg-[#161b22] border-slate-800'}`}
                      >
                          <div className="flex justify-between items-start mb-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(ticket.durum)}`}>{ticket.durum}</span>
                              <span className="text-[10px] text-slate-500">{new Date(ticket.created_at).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <h4 className="font-bold text-white text-sm mb-1 line-clamp-1">{ticket.konu}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2">{ticket.mesaj}</p>
                          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                              <User size={12}/> {ticket.bayi_adi}
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>

      {/* SAĞ: DETAY */}
      <div className={`${selectedTicket ? 'flex' : 'hidden md:flex'} flex-col flex-1 bg-[#161b22] border border-slate-800 rounded-3xl overflow-hidden h-[calc(100vh-8rem)]`}>
          {selectedTicket ? (
              <>
                  <div className="p-6 border-b border-white/5 flex justify-between items-start bg-[#0d1117]">
                      <div>
                          <div className="flex items-center gap-3 mb-2">
                              <button onClick={() => setSelectedTicket(null)} className="md:hidden p-1 bg-white/5 rounded-lg mr-2"><X size={16}/></button>
                              <h2 className="text-xl font-bold text-white">{selectedTicket.konu}</h2>
                              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(selectedTicket.durum)}`}>{selectedTicket.durum}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span className="flex items-center gap-1"><User size={14}/> {selectedTicket.bayi_adi}</span>
                              <span className="flex items-center gap-1"><Clock size={14}/> {new Date(selectedTicket.created_at).toLocaleString('tr-TR')}</span>
                          </div>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => handleDelete(selectedTicket.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Sil"><Trash2 size={18}/></button>
                      </div>
                  </div>

                  <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
                      <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">{selectedTicket.bayi_adi?.charAt(0)}</div>
                          <div className="flex-1">
                              <div className="bg-[#0b0e14] border border-slate-700 p-4 rounded-r-2xl rounded-bl-2xl text-sm text-slate-300 leading-relaxed">{selectedTicket.mesaj}</div>
                          </div>
                      </div>
                      <div className="flex justify-center my-6">
                          <div className="flex gap-3 bg-[#0b0e14] p-2 rounded-2xl border border-slate-800">
                              <button onClick={() => handleUpdateStatus(selectedTicket.id, 'İnceleniyor')} className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${selectedTicket.durum === 'İnceleniyor' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'border-transparent text-slate-500 hover:text-white'}`}>İnceleniyor</button>
                              <button onClick={() => handleUpdateStatus(selectedTicket.id, 'Yanıtlandı')} className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${selectedTicket.durum === 'Yanıtlandı' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-white'}`}>Yanıtlandı</button>
                              <button onClick={() => handleUpdateStatus(selectedTicket.id, 'Çözüldü')} className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${selectedTicket.durum === 'Çözüldü' ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-transparent text-slate-500 hover:text-white'}`}>Çözüldü</button>
                          </div>
                      </div>
                  </div>
                  <div className="p-4 border-t border-white/5 bg-[#0d1117]"><div className="flex items-center justify-center text-slate-500 text-xs gap-2"><AlertCircle size={14}/> Durum değişikliği bayi panelinde anlık görünür.</div></div>
              </>
          ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50"><MessageSquare size={64} className="mb-4 text-purple-500 opacity-20"/><p>Detayları görmek için listeden bir talep seçin.</p></div>
          )}
      </div>
    </div>
  );
}