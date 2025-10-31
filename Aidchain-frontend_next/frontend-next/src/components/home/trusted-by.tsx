"use client"

export function TrustedBy() {
  const partners = [
    "Johns Hopkins University",
    "Mayo Clinic Research",
    "Stanford Medicine",
    "MIT Medical Lab",
    "Harvard Medical School",
    "Cleveland Clinic"
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Trusted By Leading Institutions</h2>
          <p className="text-xl text-muted-foreground">
            Partnering with world-class organizations across multiple industries
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <div key={index} className="text-center">
              <div className="h-16 bg-muted flex items-center justify-center px-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {partner}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Join our network of trusted partners</p>
          <div className="flex justify-center gap-4">
            <div className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium">
              500+ Datasets
            </div>
            <div className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium">
              50+ Institutions
            </div>
            <div className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium">
              1M+ Records
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}