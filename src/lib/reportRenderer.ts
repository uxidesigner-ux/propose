import { withBase } from '../utils/paths';

export type ReportBlock = {
  id: string;
  type: string;
  sectionId: string;
  navLabel: string;
  visibleInNav: boolean;
  title: string;
  description: string;
  styleVariant: string;
  order: number;
  [key: string]: any;
};

export type ReportData = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  theme: string;
  sources: string[];
  blocks: ReportBlock[];
};

export const validateChartBlock = (block: ReportBlock): string[] => {
  const errors: string[] = [];
  if (!block.chart?.labels || !Array.isArray(block.chart.labels)) {
    errors.push(`Chart block ${block.id} is missing labels array.`);
    return errors;
  }
  for (const dataset of block.chart.datasets ?? []) {
    if (!Array.isArray(dataset.data) || dataset.data.length !== block.chart.labels.length) {
      errors.push(`Chart block ${block.id} dataset "${dataset.label ?? 'unnamed'}" length must match labels length.`);
    }
  }
  return errors;
};

const esc = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const renderBlockHtml = (block: ReportBlock): string => {
  const heading = `<h2>${esc(block.title ?? '')}</h2><p>${esc(block.description ?? '')}</p>`;

  if (block.type === 'hero') return `<section id="${block.sectionId}" class="report-block hero">${heading}</section>`;
  if (block.type === 'rich-text') return `<section id="${block.sectionId}" class="report-block rich-text">${heading}<div>${block.body ?? ''}</div></section>`;
  if (block.type === 'kpi-grid') {
    const items = (block.items ?? []).map((item: any) => `<li><strong>${esc(item.value ?? '')}</strong><span>${esc(item.label ?? '')}</span></li>`).join('');
    return `<section id="${block.sectionId}" class="report-block kpi-grid">${heading}<ul>${items}</ul></section>`;
  }
  if (block.type === 'table') {
    const headers = (block.headers ?? []).map((h: string) => `<th>${esc(h)}</th>`).join('');
    const rows = (block.rows ?? []).map((r: string[]) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('');
    return `<section id="${block.sectionId}" class="report-block table">${heading}<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></section>`;
  }
  if (block.type === 'timeline') {
    const points = (block.items ?? []).map((item: any) => `<li><h3>${esc(item.title ?? '')}</h3><p>${esc(item.copy ?? '')}</p></li>`).join('');
    return `<section id="${block.sectionId}" class="report-block timeline">${heading}<ol>${points}</ol></section>`;
  }
  if (block.type === 'quote-cards') {
    const cards = (block.items ?? []).map((item: any) => `<blockquote><p>${esc(item.quote ?? '')}</p><cite>${esc(item.author ?? '')}</cite></blockquote>`).join('');
    return `<section id="${block.sectionId}" class="report-block quote-cards">${heading}<div>${cards}</div></section>`;
  }
  if (block.type === 'chart') {
    const errors = validateChartBlock(block);
    const errorHtml = errors.length ? `<p class="chart-error">${errors.join(' ')}</p>` : '';
    return `<section id="${block.sectionId}" class="report-block chart">${heading}${errorHtml}<div class="chart-bars">${(block.chart?.labels ?? []).map((label: string, i: number) => {
      const value = block.chart.datasets?.[0]?.data?.[i] ?? 0;
      return `<div class="bar"><span>${esc(label)}</span><i style="height:${Math.max(8, value)}px"></i><b>${value}</b></div>`;
    }).join('')}</div></section>`;
  }
  if (block.type === 'accordion') {
    const items = (block.items ?? []).map((item: any) => `<details><summary>${esc(item.title ?? '')}</summary><p>${esc(item.copy ?? '')}</p></details>`).join('');
    return `<section id="${block.sectionId}" class="report-block accordion">${heading}${items}</section>`;
  }
  if (block.type === 'cta-link') {
    return `<section id="${block.sectionId}" class="report-block cta-link">${heading}<p><a href="${withBase(block.href ?? '/')}">${esc(block.label ?? 'Learn more')}</a></p></section>`;
  }

  return `<section id="${block.sectionId}" class="report-block">${heading}</section>`;
};

export const renderReportBlocks = (blocks: ReportBlock[]) =>
  [...blocks].sort((a, b) => a.order - b.order).map(renderBlockHtml).join('');
