'use client'

import Form from 'next/form'
import { input } from './action'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useActionState, useEffect, useState } from 'react'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@/components/ui/input-group'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import SubmitButton from '@/components/SubmitButton'
import { redirect } from 'next/navigation'
import { decapitalize } from '@/lib/capitalize'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Preferences() {
	const [preferences, _setPreferences] = useState<any>(
		typeof window !== 'undefined' && localStorage
			? JSON.parse(localStorage.getItem('preferences') as string)
			: undefined
	)
	const [calories, setCalories] = useState(1500)
	const [goal, setGoal] = useState('Weight Loss')
	const [formState, formAction] = useActionState(input, { data: '' })
	const [error, setError] = useState('')
	const [filledIn, setFilledIn] = useState(false)
	const [indonesian, setIndonesian] = useState(
		preferences
			? (decapitalize(preferences.cuisines) as string[]).includes(
					'indonesian'
			  )
			: false
	)
	const [western, setWestern] = useState(
		preferences
			? (decapitalize(preferences.cuisines) as string[]).includes(
					'western'
			  )
			: false
	)
	const [asian, setAsian] = useState(
		preferences
			? (decapitalize(preferences.cuisines) as string[]).includes(
					'asian'
			  )
			: false
	)
	const [mediterranean, setMediterranean] = useState(
		preferences
			? (decapitalize(preferences.cuisines) as string[]).includes(
					'mediterranean'
			  )
			: false
	)

	useEffect(() => {
		if (formState.data.length !== 0) {
			localStorage.setItem('preferences', JSON.stringify(formState.input))
			localStorage.setItem('meals', JSON.stringify(formState.data))
			localStorage.setItem('now', new Date().toISOString())
			localStorage.removeItem('groceries_done')
			redirect('/meals/1')
		}
	}, [formState])

	useEffect(() => {
		if (preferences) {
			setGoal(preferences.goal)
			setCalories(preferences.calories)
			setFilledIn(indonesian || western || asian || mediterranean)
		}
	}, [preferences])

	return (
		<Form action={formAction} className='py-15 md:px-50 px-25 bg-[#effdf8]'>
			<FieldSet>
				<FieldLegend className='uppercase text-center'>
					weekly meal planner
				</FieldLegend>
				<FieldDescription className='text-center'>
					AI-powered meal planning
				</FieldDescription>
				<FieldGroup className='mt-5 lg:mt-0'>
					<Field>
						<FieldLabel htmlFor='goal'>🎯 What's your goal?</FieldLabel>
						<RadioGroup
							defaultValue={
								preferences
									? (decapitalize(preferences.goal) as string)
									: 'weight-loss'
							}
							id='goal'
							name='goal'
							onValueChange={(value) => {
								switch (value) {
									case 'weight-loss':
										setCalories(1500)
										setGoal('Weight Loss')
										break
									case 'muscle-gain':
										setCalories(2500)
										setGoal('Muscle Gain')
										break
									case 'maintenance':
										setCalories(2000)
										setGoal('Maintenance')
										break
									case 'healthy-eating':
										setCalories(2200)
										setGoal('Healthy Eating')
										break
								}
							}}
						>
							<div className='flex items-center gap-3'>
								<RadioGroupItem value='weight-loss' id='r1' />
								<Label htmlFor='r1'>Weight Loss</Label>
							</div>
							<div className='flex items-center gap-3'>
								<RadioGroupItem value='muscle-gain' id='r2' />
								<Label htmlFor='r2'>Muscle Gain</Label>
							</div>
							<div className='flex items-center gap-3'>
								<RadioGroupItem value='maintenance' id='r3' />
								<Label htmlFor='r3'>Maintenance</Label>
							</div>
							<div className='flex items-center gap-3'>
								<RadioGroupItem value='healthy-eating' id='r4' />
								<Label htmlFor='r4'>Healthy Eating</Label>
							</div>
						</RadioGroup>
					</Field>
					<Field className='w-fit gap-2'>
						<FieldLabel htmlFor='calories'>📊 Daily calorie target</FieldLabel>
						<InputGroup className='bg-white'>
							<InputGroupInput
								id='calories'
								name='calories'
								type='number'
								value={calories}
								onChange={(e) => {
									setCalories(Number(e.target.value))
									if (goal === 'Weight Loss') {
										if (Number(e.target.value) < 1500) setError('too low')
										else if (Number(e.target.value) > 2400) setError('too high')
										else setError('')
									}
									if (goal === 'Muscle Gain') {
										if (Number(e.target.value) < 2500) setError('too low')
										else if (Number(e.target.value) > 3600) setError('too high')
										else setError('')
									}
									if (goal === 'Maintenance') {
										if (Number(e.target.value) < 2000) setError('too low')
										else if (Number(e.target.value) > 2500) setError('too high')
										else setError('')
									}
									if (goal === 'Healthy Eating') {
										if (Number(e.target.value) < 2200) setError('too low')
										else if (Number(e.target.value) > 3000) setError('too high')
										else setError('')
									}
								}}
							/>
							<InputGroupAddon align='inline-end'>
								<InputGroupText>kcal</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
						{error && <p className='text-red-600'>Calorie target is {error}</p>}
						<p className='text-xs'>Based on your goal: {goal}</p>
					</Field>
					<Field className='w-40'>
						<FieldLabel htmlFor='diet'>🥗 Diet type</FieldLabel>
						<Select
							defaultValue={
								preferences
									? (decapitalize(preferences.diet) as string)
									: 'standard'
							}
							name='diet'
						>
							<SelectTrigger className='bg-white'>
								<SelectValue placeholder='Diet type' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Diet type</SelectLabel>
									<SelectItem value='standard'>Standard</SelectItem>
									<SelectItem value='vegetarian'>Vegetarian</SelectItem>
									<SelectItem value='vegan'>Vegan</SelectItem>
									<SelectItem value='keto'>Keto</SelectItem>
									<SelectItem value='low-carb'>Low-Carb</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</Field>
					<Field className='w-fit'>
						<FieldLabel htmlFor='allergies'>
							⚠️ Allergies (select all that apply)
						</FieldLabel>
						<div id='allergies' className='grid grid-cols-3 gap-3'>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='nuts'
									name='nuts'
									defaultChecked={
										preferences
											? (
													decapitalize(preferences.allergies) as string[]
											  ).includes('nuts')
											: false
									}
								/>
								<Label htmlFor='nuts'>Nuts</Label>
							</div>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='dairy'
									name='dairy'
									defaultChecked={
										preferences
											? (
													decapitalize(preferences.allergies) as string[]
											  ).includes('dairy')
											: false
									}
								/>
								<Label htmlFor='dairy'>Dairy</Label>
							</div>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='gluten'
									name='gluten'
									defaultChecked={
										preferences
											? (
													decapitalize(preferences.allergies) as string[]
											  ).includes('gluten')
											: false
									}
								/>
								<Label htmlFor='gluten'>Gluten</Label>
							</div>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='seafood'
									name='seafood'
									defaultChecked={
										preferences
											? (
													decapitalize(preferences.allergies) as string[]
											  ).includes('seafood')
											: false
									}
								/>
								<Label htmlFor='seafood'>Seafood</Label>
							</div>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='eggs'
									name='eggs'
									defaultChecked={
										preferences
											? (
													decapitalize(preferences.allergies) as string[]
											  ).includes('eggs')
											: false
									}
								/>
								<Label htmlFor='eggs'>Eggs</Label>
							</div>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='soy'
									name='soy'
									defaultChecked={
										preferences
											? (
													decapitalize(preferences.allergies) as string[]
											  ).includes('soy')
											: false
									}
								/>
								<Label htmlFor='soy'>Soy</Label>
							</div>
						</div>
					</Field>
					<Field className='w-fit'>
						<FieldLabel htmlFor='cuisine'>🍽️ Cuisine preference</FieldLabel>
						<div id='cuisine' className='grid grid-cols-2 gap-3'>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='indonesian'
									name='indonesian'
									checked={indonesian}
									onCheckedChange={(state: boolean) => {
										setIndonesian(state)
										setFilledIn(state || western || asian || mediterranean)
									}}
								/>
								<Label htmlFor='indonesian'>Indonesian</Label>
							</div>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='western'
									name='western'
									checked={western}
									onCheckedChange={(state: boolean) => {
										setWestern(state)
										setFilledIn(indonesian || state || asian || mediterranean)
									}}
								/>
								<Label htmlFor='western'>Western</Label>
							</div>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='asian'
									name='asian'
									checked={asian}
									onCheckedChange={(state: boolean) => {
										setAsian(state)
										setFilledIn(indonesian || western || state || mediterranean)
									}}
								/>
								<Label htmlFor='asian'>Asian</Label>
							</div>
							<div className='flex items-center gap-2'>
								<Checkbox
									id='mediterranean'
									name='mediterranean'
									checked={mediterranean}
									onCheckedChange={(state: boolean) => {
										setMediterranean(state)
										setFilledIn(indonesian || western || asian || state)
									}}
								/>
								<Label htmlFor='mediterranean'>Mediterranean</Label>
							</div>
						</div>
						{!filledIn && (
							<p className='text-red-600 text-xs'>
								One of the cuisine above should be checked
							</p>
						)}
					</Field>

					<Field className='w-fit'>
						<FieldLabel htmlFor='dislikes'>
							🚫 Foods you dislike (optional, separate with commas [ex:
							tofu,noodle,etc])
						</FieldLabel>
						<Input
							id='dislikes'
							name='dislikes'
							type='text'
							defaultValue={preferences && decapitalize(preferences.dislikes)}
							placeholder='Foods you dislike'
							className='bg-white'
						/>
					</Field>
					<div className='flex gap-2'>
						<SubmitButton invalid={!filledIn} />
						{preferences && (
							<Link href='/meals/1' className='flex-1'>
								<Button className='hover:cursor-pointer w-full'>
									Go to meals page
								</Button>
							</Link>
						)}
					</div>
				</FieldGroup>
			</FieldSet>
		</Form>
	)
}
