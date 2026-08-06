"use client";

import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";

interface SearchableDropdownProps {
  label: ReactNode;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  allowCustom?: boolean;
  id?: string;
}

const OTHER = "__OTHER__";

export default function SearchableDropdown({
  label,
  placeholder = "Type to search...",
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  loading = false,
  allowCustom = false,
  id,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [customVal, setCustomVal] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const sorted = useMemo(() => [...options].sort((a, b) => a.localeCompare(b)), [options]);

  const filtered = useMemo(() => {
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter((o) => o.toLowerCase().includes(q));
  }, [sorted, query]);

  useEffect(() => { setQuery(""); }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
        if (customMode && !customVal.trim()) setCustomMode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [customMode, customVal]);

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);
  useEffect(() => { if (customMode && customInputRef.current) customInputRef.current.focus(); }, [customMode]);

  useEffect(() => {
    if (open && listRef.current && value) {
      const idx = filtered.indexOf(value);
      if (idx >= 0) {
        const item = listRef.current.children[idx] as HTMLElement;
        item?.scrollIntoView({ block: "nearest" });
      }
    }
  }, [open, filtered, value]);

  const select = (opt: string) => {
    if (opt === OTHER) {
      setCustomMode(true);
      setCustomVal("");
      setOpen(false);
      setQuery("");
      return;
    }
    setCustomMode(false);
    onChange(opt);
    setOpen(false);
    setQuery("");
  };

  const submitCustom = () => {
    if (customVal.trim()) onChange(customVal.trim());
    setCustomMode(false);
    setCustomVal("");
  };

  const cancelCustom = () => {
    setCustomMode(false);
    setCustomVal("");
  };

  const displayText = value || "";

  return (
    <div className="loc-sd" ref={containerRef} id={id}>
      <style>{`
        .loc-sd { position: relative; width: 100%; }
        .loc-sd-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #0f172a;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
          font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
        }
        .loc-sd-label .hi {
          text-transform: none;
          font-weight: 600;
          color: #0f172a;
          font-family: 'Noto Sans Devanagari', 'DM Sans', sans-serif;
        }
        .loc-sd-label .req { color: #dc2626; margin-left: 2px; }

        /* ── Trigger ── */
        .loc-sd-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 9px 11px;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
          color: #111827;
          background: #ffffff;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
          -webkit-appearance: none;
          appearance: none;
          min-height: 38px;
          box-sizing: border-box;
        }
        .loc-sd-trigger:hover { border-color: #9ca3af; }
        .loc-sd-trigger:focus,
        .loc-sd-trigger.open {
          border-color: #0d8f72;
          box-shadow: 0 0 0 3px rgba(13,143,114,0.1);
        }
        .loc-sd-trigger.disabled {
          background: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
          opacity: 0.7;
        }
        .loc-sd-trigger .placeholder { color: #9ca3af; }
        .loc-sd-trigger-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .loc-sd-arrow {
          width: 0; height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid #6b7280;
          margin-left: 8px;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .loc-sd-arrow.open { transform: rotate(180deg); }

        /* ── Panel ── */
        .loc-sd-panel {
          position: absolute;
          top: calc(100% + 4px);
          left: 0; right: 0;
          background: #ffffff;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          z-index: 1;
          max-height: 240px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .loc-sd-search-wrap { padding: 8px; border-bottom: 1px solid #e5e7eb; flex-shrink: 0; }
        .loc-sd-search {
          width: 100%; padding: 7px 10px; border: 1.5px solid #d1d5db; border-radius: 6px;
          font-size: 13px; font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
          color: #111827; outline: none; box-sizing: border-box; transition: border-color 0.15s;
        }
        .loc-sd-search:focus { border-color: #0d8f72; }
        .loc-sd-list { list-style: none; margin: 0; padding: 4px 0; overflow-y: auto; flex: 1; }
        .loc-sd-item {
          padding: 8px 12px; font-size: 13px;
          font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
          color: #374151; cursor: pointer; transition: background 0.1s;
        }
        .loc-sd-item:hover { background: #f0fdf4; }
        .loc-sd-item.selected { background: #e6f7f3; color: #0d8f72; font-weight: 600; }
        .loc-sd-item.other-item {
          border-top: 1px solid #e5e7eb; color: #0d8f72; font-weight: 600;
          display: flex; align-items: center; gap: 6px;
        }
        .loc-sd-item.other-item:hover { background: #e6f7f3; }
        .loc-sd-empty { padding: 12px; text-align: center; font-size: 12px; color: #9ca3af; }

        /* ── Custom input mode ── */
        .loc-custom {
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 38px;
          border: 1.5px solid #0d8f72;
          border-radius: 8px;
          background: #f0fdf4;
          box-shadow: 0 0 0 3px rgba(13,143,114,0.1);
          box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
          overflow: hidden;
        }
        .loc-custom:focus-within {
          border-color: #0d8f72;
          box-shadow: 0 0 0 3px rgba(13,143,114,0.15);
        }
        .loc-custom-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 38px;
          flex-shrink: 0;
          color: #0d8f72;
        }
        .loc-custom-icon svg { width: 15px; height: 15px; }
        .loc-custom-input {
          flex: 1;
          height: 36px;
          padding: 0 4px 0 0;
          border: none;
          outline: none;
          font-size: 13px;
          font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
          color: #111827;
          background: transparent;
          min-width: 0;
        }
        .loc-custom-input::placeholder { color: #6b7280; }
        .loc-custom-btns {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 0 6px;
          flex-shrink: 0;
          height: 38px;
        }
        .loc-cbtn {
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          border: none; border-radius: 6px; cursor: pointer;
          transition: all 0.15s; background: transparent;
        }
        .loc-cbtn svg { width: 15px; height: 15px; }
        .loc-cbtn-ok { color: #0d8f72; }
        .loc-cbtn-ok:hover { background: #0d8f72; color: #fff; }
        .loc-cbtn-x { color: #9ca3af; }
        .loc-cbtn-x:hover { background: #fef2f2; color: #dc2626; }
      `}</style>

      <label className="loc-sd-label">
        {label} {required && <span className="req">*</span>}
      </label>

      {customMode ? (
        <div className="loc-custom">
          <div className="loc-custom-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <input
            ref={customInputRef}
            className="loc-custom-input"
            type="text"
            placeholder="Type here..."
            value={customVal}
            onChange={(e) => setCustomVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); submitCustom(); }
              if (e.key === "Escape") cancelCustom();
            }}
          />
          <div className="loc-custom-btns">
            <button type="button" className="loc-cbtn loc-cbtn-ok" title="Confirm" onClick={submitCustom}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
            <button type="button" className="loc-cbtn loc-cbtn-x" title="Cancel" onClick={cancelCustom}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`loc-sd-trigger ${open ? "open" : ""} ${disabled ? "disabled" : ""}`}
          onClick={() => { if (!disabled && !loading) setOpen((o) => !o); }}
          role="combobox"
          aria-expanded={open}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); setQuery(""); }
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!disabled && !loading) setOpen((o) => !o);
            }
          }}
        >
          <span className={`loc-sd-trigger-text ${displayText ? "" : "placeholder"}`}>
            {loading ? "Loading..." : displayText || placeholder}
          </span>
          <span className={`loc-sd-arrow ${open ? "open" : ""}`} />
        </div>
      )}

      {open && (
        <div className="loc-sd-panel">
          <div className="loc-sd-search-wrap">
            <input
              ref={inputRef}
              className="loc-sd-search"
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") { setOpen(false); setQuery(""); } }}
            />
          </div>
          <ul className="loc-sd-list" ref={listRef}>
            {filtered.length === 0 && !query && allowCustom ? (
              <li className="loc-sd-item other-item" onClick={() => select(OTHER)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Other / अन्य
              </li>
            ) : filtered.length === 0 ? (
              <li className="loc-sd-empty">{query ? "No matches found" : "No options available"}</li>
            ) : (
              <>
                {filtered.map((opt) => (
                  <li key={opt} className={`loc-sd-item ${opt === value ? "selected" : ""}`} onClick={() => select(opt)}>
                    {opt}
                  </li>
                ))}
                {allowCustom && (
                  <li className="loc-sd-item other-item" onClick={() => select(OTHER)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Other / अन्य
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
