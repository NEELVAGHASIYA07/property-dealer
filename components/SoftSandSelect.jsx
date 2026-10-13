"use client";

import React, { useState, useRef, useEffect, useId, useCallback } from "react";
import { ChevronDown } from "lucide-react";

/**
 * SoftSandSelect - Premium reusable "Soft Sand" dropdown component.
 * Supports options as an array or as <option> children.
 * Retains exact container dimensions and emits synthetic events matching native <select>.
 */
export default function SoftSandSelect({
  id: propId,
  name,
  value,
  defaultValue,
  onChange,
  options = null,
  children,
  placeholder = "",
  disabled = false,
  required = false,
  className = "",
  style,
  triggerStyle,
  menuStyle,
  "aria-label": ariaLabel,
  autoFocus = false,
}) {
  const generatedId = useId();
  const selectId = propId || generatedId;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [internalValue, setInternalValue] = useState(
    value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : ""
  );
  const [placement, setPlacement] = useState("bottom"); // "bottom" | "top"
  const [maxMenuHeight, setMaxMenuHeight] = useState(260);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Auto-detect available viewport space and open upward if not enough space below
  const updatePlacement = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Standard dropdown menu height (~220-250px)
    const neededSpace = 240;

    // If space below is not enough to show the full list (spaceBelow < neededSpace)
    // AND there is more room above (spaceAbove > spaceBelow):
    // Open UPWARD!
    if (spaceBelow < neededSpace && spaceAbove > spaceBelow) {
      setPlacement("top");
      setMaxMenuHeight(Math.max(130, Math.min(280, spaceAbove - 20)));
    } else {
      setPlacement("bottom");
      setMaxMenuHeight(Math.max(130, Math.min(280, spaceBelow - 20)));
    }
  }, []);

  // Sync internalValue when controlled value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(String(value));
    }
  }, [value]);

  // Extract parsed options from options prop or <option> children
  const parsedOptions = React.useMemo(() => {
    if (options && Array.isArray(options)) {
      return options.map((opt) => {
        if (typeof opt === "object" && opt !== null) {
          return {
            value: opt.value !== undefined ? String(opt.value) : "",
            label: opt.label !== undefined ? opt.label : String(opt.value),
            disabled: !!opt.disabled,
          };
        }
        return {
          value: String(opt),
          label: String(opt),
          disabled: false,
        };
      });
    }

    if (children) {
      const items = [];
      React.Children.forEach(children, (child) => {
        if (!child) return;
        if (child.type === "option") {
          const val =
            child.props.value !== undefined
              ? String(child.props.value)
              : typeof child.props.children === "string"
              ? child.props.children
              : "";
          items.push({
            value: val,
            label: child.props.children,
            disabled: !!child.props.disabled,
          });
        }
      });
      return items;
    }

    return [];
  }, [options, children]);

  // Find currently selected option
  const selectedOption = parsedOptions.find(
    (opt) => String(opt.value) === String(internalValue)
  );

  // Label to display on the trigger
  const displayLabel = selectedOption
    ? selectedOption.label
    : placeholder || (parsedOptions[0] ? parsedOptions[0].label : "");

  // Close when another Soft Sand dropdown opens anywhere on the page
  useEffect(() => {
    const handleOtherOpen = (e) => {
      if (e.detail !== selectId) {
        setIsOpen(false);
      }
    };
    window.addEventListener("soft-sand-dropdown-open", handleOtherOpen);
    return () => {
      window.removeEventListener("soft-sand-dropdown-open", handleOtherOpen);
    };
  }, [selectId]);

  // Close when clicked outside
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && menuRef.current) {
      const items = menuRef.current.querySelectorAll(".soft-sand-option");
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen, highlightedIndex]);

  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    if (!isOpen) {
      updatePlacement();
      window.dispatchEvent(
        new CustomEvent("soft-sand-dropdown-open", { detail: selectId })
      );
      // Highlight currently selected index
      const curIdx = parsedOptions.findIndex(
        (opt) => String(opt.value) === String(internalValue)
      );
      setHighlightedIndex(curIdx >= 0 ? curIdx : 0);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [disabled, isOpen, selectId, parsedOptions, internalValue, updatePlacement]);

  // Recalculate placement and max height dynamically on scroll and window resize while open
  useEffect(() => {
    if (!isOpen) return;
    updatePlacement();
    const handleRecalc = () => {
      updatePlacement();
    };
    window.addEventListener("scroll", handleRecalc, true);
    window.addEventListener("resize", handleRecalc);
    return () => {
      window.removeEventListener("scroll", handleRecalc, true);
      window.removeEventListener("resize", handleRecalc);
    };
  }, [isOpen, updatePlacement]);

  const handleSelect = useCallback(
    (opt) => {
      if (opt.disabled) return;
      setIsOpen(false);
      setInternalValue(opt.value);

      if (onChange) {
        const syntheticEvent = {
          target: { value: opt.value, name, id: selectId },
          currentTarget: { value: opt.value, name, id: selectId },
          value: opt.value,
        };
        onChange(syntheticEvent);
      }
      triggerRef.current?.focus();
    },
    [name, onChange, selectId]
  );

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        toggleDropdown();
      }
      return;
    }

    if (e.key === "Escape" || e.key === "Tab") {
      setIsOpen(false);
      if (e.key === "Escape") {
        e.preventDefault();
        triggerRef.current?.focus();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        let next = prev + 1;
        while (next < parsedOptions.length && parsedOptions[next]?.disabled) {
          next++;
        }
        return next < parsedOptions.length ? next : prev;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        let prevIdx = prev - 1;
        while (prevIdx >= 0 && parsedOptions[prevIdx]?.disabled) {
          prevIdx--;
        }
        return prevIdx >= 0 ? prevIdx : prev;
      });
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlightedIndex >= 0 && parsedOptions[highlightedIndex]) {
        handleSelect(parsedOptions[highlightedIndex]);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`soft-sand-select-wrap ${className ? className + "-wrap" : ""} ${isOpen ? "is-open" : ""} ${placement === "top" ? "opens-upward" : ""} ${disabled ? "is-disabled" : ""}`}
      style={style}
    >
      <button
        ref={triggerRef}
        type="button"
        id={selectId}
        className={`soft-sand-trigger ${className || ""}`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        style={triggerStyle}
      >
        <span className="soft-sand-label">{displayLabel}</span>
        <ChevronDown
          size={15}
          className={`soft-sand-arrow ${isOpen ? "is-open" : ""}`}
        />
      </button>

      {/* Hidden native select keeps standard form submissions & screen-readers 100% working */}
      <select
        name={name}
        value={internalValue}
        onChange={() => {}}
        tabIndex={-1}
        aria-hidden="true"
        className="soft-sand-hidden-select"
        required={required}
      >
        {parsedOptions.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {typeof opt.label === "string" ? opt.label : opt.value}
          </option>
        ))}
      </select>

      {isOpen && (
        <div
          ref={menuRef}
          className={`soft-sand-menu ${placement === "top" ? "opens-upward" : ""}`}
          role="listbox"
          aria-labelledby={selectId}
          style={{
            maxHeight: `${maxMenuHeight}px`,
            ...menuStyle,
          }}
        >
          {parsedOptions.map((opt, idx) => {
            const isSelected = String(opt.value) === String(internalValue);
            const isHighlighted = idx === highlightedIndex;

            return (
              <div
                key={opt.value + "_" + idx}
                role="option"
                aria-selected={isSelected}
                className={`soft-sand-option ${isSelected ? "is-selected" : ""} ${
                  isHighlighted ? "is-highlighted" : ""
                } ${opt.disabled ? "is-disabled" : ""}`}
                onClick={() => handleSelect(opt)}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
