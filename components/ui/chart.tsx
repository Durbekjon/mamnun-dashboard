import React from "react"

interface CartesianGridProps {
  strokeDasharray?: string
  stroke?: string
}

export const CartesianGrid: React.FC<CartesianGridProps> = ({ strokeDasharray, stroke }) => {
  return null
}

interface XAxisProps {
  dataKey?: string
  tick?: any
  axisLine?: any
}

export const XAxis: React.FC<XAxisProps> = ({ dataKey, tick, axisLine }) => {
  return null
}

interface YAxisProps {
  tick?: any
  axisLine?: any
}

export const YAxis: React.FC<YAxisProps> = ({ tick, axisLine }) => {
  return null
}

interface TooltipProps {
  contentStyle?: React.CSSProperties
}

export const Tooltip: React.FC<TooltipProps> = ({ contentStyle }) => {
  return null
}

interface LegendProps {
  wrapperStyle?: React.CSSProperties
  formatter?: (value: string) => React.ReactNode
}

export const Legend: React.FC<LegendProps> = ({ wrapperStyle, formatter }) => {
  return null
}

interface LineChartProps {
  data?: any[]
  children: React.ReactNode
}

export const LineChart: React.FC<LineChartProps> = ({ data, children }) => {
  return React.createElement("div", null, children)
}

interface LineProps {
  type?: string
  dataKey?: string
  stroke?: string
  strokeWidth?: number
  activeDot?: any
  name?: string
}

export const Line: React.FC<LineProps> = ({ type, dataKey, stroke, strokeWidth, activeDot, name }) => {
  return null
}

interface ResponsiveContainerProps {
  width?: string | number
  height?: string | number
  children: React.ReactNode
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ width, height, children }) => {
  return React.createElement("div", null, children)
}

